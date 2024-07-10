import analyticsLogic from './analyticsLogic'
import eventsLogic from './eventsLogic'

export default function chartsLogic() {
  async function betsPerEvent() {
    try {
      const siteEvents = await eventsLogic().getEvents()

      const events = await Promise.all(
        siteEvents.map(async (event) => {
          event = await analyticsLogic().betsEventData(event.id)
          event = event.data

          return {name: event.eventName, total: event.totalBets}
        })
      )

      return events
    } catch (error) {
      return error
    }
  }

  return {
    betsPerEvent
  }
}
