import {Http, Response Headers} from "@angular/http";
import {Injectable, EventEmitter} from "@angular/core";
import 'rxjs/RX';
import {Observable} from "rxjs";

import {Message} from "./message.model";

@Injectable()
export class MessageService{
   private messages: Message[]=[];
   messageIsEdit = new EventEmitter<Message>();

   constructor(private http: Http){}

   addMessage(message: Message) {
    const body = JSON.stringify(message); //
    const headers = new Headers({'Content-Type': 'application/json'})
    return this.http.post(, body {headers: headers}) 
    .map((response: Response)=> {
      const result = response.json())
      return message =  new Message(result.obj.content, 'Dummy', result.obj._id, null);
      this.messages.push(message);
      return message
    }
    .catch((error: Response)=> Observable.throw(error.json())); 
  
   };
   getMessages(){ 
     
      return this.http.get('http://localhost:3000/message')
     .map((response: Response) =>{
       const messages = response.json().obj; //obj comes from messages.js. we named it obj but we can call it anything
      let transformedMessages: Message[]=[];
      for (let message of messages){
        transformedMessages.push(new Message(message.content,  'dummy', message._id, null))
      }
      this.messages = transformedMessages;
      return transformedMessages;
      }).catch((error: Response)=> Observable.throw(error.json())); 
   };

   editMessage(message: Message){
    this.messageIsEdit.emit(message);
   };

   updateMessage(message: Message){
    const body = JSON.stringify(message); 
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('http://localhost:3000/message/' + message.messageId, body , {headers: headers}) 
    .map((response: Response)=>response.json())
    .catch((error: Response)=> Observable.throw(error.json())); 
  
   }

   deleteMessage(message: Message){
     this.messages.splice(this.messages.indexOf(message),1);
   }
}

//this line does not send req. it sets up an observable , which holds req, which allows to subscribe to any data the req will give back but which doesnt send the req yet.  We need to subscribe in the component
//.json send only data associated with response. throws away status code headers, etc and turns into js object. .map turns response into observable automatically, .catch does not