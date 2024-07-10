import analyticsLogic from './analyticsLogic'
import eventsLogic from './eventsLogic'

export default function chartsLogic() {
  async function betsPerEvent() {
    try {
      return await _extractDataFromEvent('totalBets');
    } catch (error) {
      return error
    }
  }

  async function usersPerEvent() {
    try {
      return await _extractDataFromEvent('usersCount');
    } catch (error) {
      return error
    }
  }
  
  async function _extractDataFromEvent(attr) {
    const siteEvents = await eventsLogic().getEvents()
    const events = await Promise.all(
    siteEvents.map(async (event) => {
        event = await analyticsLogic().betsEventData(event.id)
        event = event.data
        return {name: event.eventName, total: event[attr]}
    })
    )
    return events
  }

  return {
    betsPerEvent,
    usersPerEvent
  }
}
