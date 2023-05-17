import { GET_MESSAGES_DOCUMENT } from './getMessageGql';
import { GET_SENDING_RESULT_FROM_NCP_BY_REQUEST_TIME_DOCUMENT } from './getMessageSendingRequestByGql';
import { GET_MESSAGES_BY_PATIENT_DOCUMENT } from './getMessagesByPatientGql';
import { GET_MESSAGES_EACH_PATIENT_DOCUMENT } from './getMessagesEachPatientGql';
import { SEND_MESSAGE_DOCUMENT } from './sendMessageGql';

export {
  SEND_MESSAGE_DOCUMENT,
  GET_SENDING_RESULT_FROM_NCP_BY_REQUEST_TIME_DOCUMENT,
  GET_MESSAGES_DOCUMENT,
  GET_MESSAGES_EACH_PATIENT_DOCUMENT,
  GET_MESSAGES_BY_PATIENT_DOCUMENT,
};
