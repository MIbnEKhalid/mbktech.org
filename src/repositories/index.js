import { TicketRepository, ticketRepository } from "./ticket.repository.js";
import { SpamRepository, spamRepository } from "./spam.repository.js";
import { dblogin, defaultAdapter } from "mbkauthe";

export {
  TicketRepository,
  ticketRepository,
  SpamRepository,
  spamRepository,
  dblogin,
  defaultAdapter,
};

export default {
  ticketRepository,
  spamRepository,
  dblogin,
  defaultAdapter,
};
