export interface Notification {
  messages: string[];
  date: Date;
  associations: {
    rule: string;
  };
}
