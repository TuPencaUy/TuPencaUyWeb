<script setup>
import Header from "@/components/Header.vue";
import {Card, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import {onMounted, ref} from "vue";
import eventsLogic from "@/logic/eventsLogic.js";
import utils from "@/logic/utils.js";
import {Button} from "@/components/ui/button/index.js";
import {Icon} from "@iconify/vue";
import {useUserStore} from "@/store/user.js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel/index.js";
import {Label} from "@/components/ui/label/index.js";
import userLogic from "@/logic/userLogic.js";
import {useToast} from "@/components/ui/toast/index.js";
import {useEventStore} from "@/store/event.js";
import {useChatStore} from "@/store/chatStore.js";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog/index.js";
import paypalLogic from "@/logic/paypalLogic.js";

const {toast} = useToast();

let paypal = null;
let events = ref([]);
let userEvents = useUserStore().getEvents ?? [];

onMounted(async () => {
  utils().showLoader();
  useEventStore().resetCurrentEvent();
  useChatStore().resetCurrentChat();

  paypal = await paypalLogic().initPaypal();
  events.value = await eventsLogic().getEvents();
  if (userEvents?.length > 0) {
    events.value = events.value.filter(event => !userEvents.find(userEvent => userEvent.id === event.id));
  }

  utils().hideLoader();
});

async function initModal(eventId, total = 10, currencyCode = 'USD') {
  setTimeout(async () => {
    try {
      await paypal
          .Buttons({
            async createOrder() {
              const paymentObj = {
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      currency_code: currencyCode,
                      value: String(Number(total).toFixed(2))
                    }
                  }
                ]
              };

              return await paypalLogic().createOrder(paymentObj);
            },
            async onApprove(data) {
              const responseCapture = await paypalLogic().capturePayment(data?.orderID);
              if (responseCapture.status !== 'COMPLETED') throw new Error('Payment not completed');

              let paymentDone = await paypalLogic().createPaymentDB(eventId, {
                userEmail: useUserStore().getUserEmail,
                amount: total,
                transactionId: data?.orderID
              });
              if (!paymentDone) throw new Error('Payment not saved');

              toast({
                title: 'Success',
                description: 'Payment completed successfully',
                variant: 'success'
              });

              await handleSubscribe(eventId);
            },
            style: {
              layout: 'horizontal',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            }
          })
          .render('#paypal-subscription-container');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while initializing the payment',
        variant: 'destructive'
      });
    }
  });
}

async function handleSubscribe(eventId) {
  utils().showLoader();
  const response = await userLogic().subscribeToEvent(eventId);
  utils().hideLoader();
  if (!response || response?.error) {
    toast({
      title: 'Error',
      description: 'An error occurred while subscribing to the event',
      variant: 'destructive'
    });
    return;
  }

  toast({
    title: 'Success',
    description: 'You have successfully subscribed to the event',
    variant: 'success'
  });

  userEvents?.push(events.value.find(event => event.id === eventId));

  events.value = events.value.filter(event => event.id !== eventId);
}
</script>

<template>
  <Header/>
  <main>
    <div class="container mx-auto mt-8">
      <div class="w-full h-40 flex flex-col justify-center align-items-center bg-white shadow border-primary">
        <h1 class="text-4xl font-bold text-center">Events</h1>
      </div>
      <div v-if="userEvents?.length > 0" class="m-8">
        <Label class="mt-4 text-2xl">Your events</Label>
        <div class="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-4 mt-4">
          <Carousel
              class="relative w-fit max-w-screen-2xl"
              :opts="{
      align: 'start',
    }"
          >
            <CarouselContent class="-ml-1">
              <CarouselItem v-for="event in userEvents" :key="event"
                            class="w-[400px] sm:basis-1/2 md:basis-1/4 lg:basis-1/5">
                <Card id="eventId"
                      class="relative w-full h-full text-center hover:cursor-pointer group">
                  <div
                      class="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <router-link :to="`/events/${event.id}`">
                      <Button @click="useEventStore().setCurrentEvent(event.id)"
                              class="bg-green-400 hover:bg-green-600 text-white">
                        View event
                      </Button>
                    </router-link>
                  </div>
                  <CardHeader>
                    <CardTitle>{{ event.name }}</CardTitle>
                  </CardHeader>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
          </Carousel>
        </div>
      </div>
      <div v-if="events?.length > 0" class="m-8">
        <Label class="mt-4 text-2xl">Available events</Label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

          <Carousel
              class="relative w-full max-w-screen-2xl"
              :opts="{
      align: 'start',
    }"
          >
            <CarouselContent class="-ml-2">
              <CarouselItem v-for="event in events" :key="event" class="md:basis-1/2 lg:basis-1/2">
                <Card id="eventId"
                      class="relative w-full h-full text-center hover:cursor-pointer group">
                  <div
                      class="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <AlertDialog>
                      <AlertDialogTrigger as-child>
                        <Button class="bg-red-400 hover:bg-red-600 text-white"
                                @click="initModal(event?.id, event?.price ?? '10', event?.currency ?? 'USD')">
                          <Icon icon="iconoir:lock" class="w-5 h-5"/>
                          Subscribe
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Event subscription</AlertDialogTitle>
                          <AlertDialogDescription>
                            In order to subscribe to this event, you will be charged USD ${{ event.price ?? '10' }}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <div id="paypal-subscription-container" class="flex items-center justify-center w-full"/>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardHeader>
                    <CardTitle>{{ event.name }}</CardTitle>
                  </CardHeader>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
          </Carousel>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
#eventId {
  background-image: url('/public/bg-events.png');
  background-size: cover;
  background-position: center;
}
</style>
