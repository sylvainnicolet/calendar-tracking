import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const calendarUrl = req.query.calendarUrl as string;
  try {
    const response = await axios.get(calendarUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Could not fetch calendar data from the URL' });
  }
}
