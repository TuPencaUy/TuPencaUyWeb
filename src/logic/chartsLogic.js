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
    try {
      const siteEvents = await eventsLogic().getEvents();
      const events = [];
  
      for (let i = 0; i < siteEvents.length; i++) {
        const event = siteEvents[i];
        let eventData = await analyticsLogic().betsEventData(event.id);
        if (eventData && eventData.data) {
          events.push({ name: eventData.data.eventName, total: eventData.data[attr] });
        }
      }
  
      return events;
    } catch (error) {
      console.error("Error in _extractDataFromEvent:", error);
      throw error;
    }
  }  

  return {
    betsPerEvent,
    usersPerEvent
  }
}
