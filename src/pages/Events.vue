<script setup>
import Header from "@/components/Header.vue";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card/index.js";
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

const events = ref([]);
const userEvents = useUserStore().getEvents;

onMounted(async () => {
  utils().showLoader();
  events.value = await eventsLogic().getEvents();
  utils().hideLoader();
});
</script>

<template>
  <Header/>
  <main>
    <div class="container mx-auto mt-8">
      <div class="w-full h-40 flex flex-col justify-center align-items-center bg-white shadow border-primary">
        <h1 class="text-4xl font-bold text-center">Events</h1>
      </div>
      <div v-if="userEvents.length > 0" class="m-8">
        <Label class="mt-4 text-2xl">Your events</Label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Carousel
              class="relative w-full max-w-screen-2xl"
              :opts="{
      align: 'start',
    }"
          >
            <CarouselContent class="-ml-2">
              <CarouselItem v-for="event in userEvents" :key="event" class="md:basis-1/2 lg:basis-1/2">
                <Card id="eventId"
                      class="relative w-full h-full text-center hover:cursor-pointer group">
                  <div
                      class="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button class="bg-red-400 hover:bg-red-600 text-white">
                      <Icon icon="iconoir:lock" class="w-5 h-5"/>
                      Subscribe
                    </Button>
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
      <div class="m-8">
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
                    <Button class="bg-red-400 hover:bg-red-600 text-white">
                      <Icon icon="iconoir:lock" class="w-5 h-5"/>
                      Subscribe
                    </Button>
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
