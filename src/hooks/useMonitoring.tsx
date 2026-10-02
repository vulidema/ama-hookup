export function useMonitoring() {
  return {
    alerts: [],
    preferences: {
      email: true,
      push: true,
      sms: false,
    },
    insights: {
      dau: 0,
      retention: 0,
      session_duration: 0,
      conversion: 0,
    },
    engagement: {
      messages_sent: 0,
      waves_sent: 0,
      profile_views: 0,
      match_rate: 0,
    },
  };
}
