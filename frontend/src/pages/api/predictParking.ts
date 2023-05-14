import { JwtToken } from '@/services/jwt';
import { api } from '@/services/api';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    // Return an error if the request method is not POST
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { date, location, capacity, hour } = req.body;

  try {
    if (!date || !location || !capacity || !hour)
      throw new Error('Missing property');

    if (!req.headers.authorization) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    //verify auth
    JwtToken.verify(req.headers.authorization);

    try {
      const res = await api.get(`locations/${location}`)

      //get hourly logs
      const hourly = res?.data.hourly

      //choose our hour
      let targetHour = Number(hour.split(':')[0])

      //if minutes > 30, choose next hour
      if (Number(hour.split(':')[1]) > 30) {
        targetHour += 1
      }

      //get predicted value for location in hour chosen
      var predicted = hourly[targetHour-1]["capacity"]

      //subtract capacity
      predicted = Number(predicted) - Number(capacity)

      //if predicted < 0, set to 0
      if (predicted < 0) predicted = 0

    } catch(error) {
      res.status(500).json({ error: 'Prediction failed' });
      console.log(error)
      return;
    }


    //send prediction
    res.status(200).json({
      predicted,
    });

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
