import {Http, Response, Headers} from "@angular/http";
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
    const token = localStorage.getItem('token') 
       ? '?token=' + localStorage.getItem('token')
       : '';
    return this.http.post('http://localhost:3000/message' + token, body, {headers: headers}) 
    .map((response: Response)=> {

      const result = response.json();
      const message= new Message(
        result.obj.content, 
        result.obj.user.firstName, 
        result.obj._id, 
        result.obj.user._id)
      this.messages.push(message)
      return message
    })
    .catch((error: Response)=> Observable.throw(error.json())); 
  
   };
   getMessages(){ 
     
      return this.http.get('http://localhost:3000/message')
     .map((response: Response) =>{
       const messages = response.json().obj; //obj comes from messages.js. we named it obj but we can call it anything
      let transformedMessages: Message[]=[];
      for (let message of messages){
        transformedMessages.push(new Message(
          message.content, 
          message.user.firstName,  //since we expanded messags to include users we can access userid from messages
          message._id, 
          message.user._id))
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
    const token = localStorage.getItem('token') 
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body , {headers: headers}) 
    .map((response: Response)=>response.json())
    .catch((error: Response)=> Observable.throw(error.json())); 
  
   }

   deleteMessage(message: Message){
     this.messages.splice(this.messages.indexOf(message),1);
     const token = localStorage.getItem('token') 
     ? '?token=' + localStorage.getItem('token')
     : ''; 
     return this.http.delete('http://localhost:3000/message/' + message.messageId + token) 
     .map((response: Response)=>response.json())
     .catch((error: Response)=> Observable.throw(error.json()));
   }
}

//this line does not send req. it sets up an observable , which holds req, which allows to subscribe to any data the req will give back but which doesnt send the req yet.  We need to subscribe in the component
//.json send only data associated with response. throws away status code headers, etc and turns into js object. .map turns response into observable automatically, .catch does not