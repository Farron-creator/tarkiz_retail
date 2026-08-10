import Dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';




Dayjs.extend(relativeTime);
Dayjs.extend(customParseFormat);
Dayjs.extend(localizedFormat).locale('id');
Dayjs.extend(utc);
Dayjs.extend(timezone);



export const dayjs = Dayjs;
