# Fireplace

Fireplace is an easy to use media playback service that lets you upload content and create watch-parties which can be enjoyed with friends and family anywhere around the world!

It's complete with user authentication, and real time playback controls. All you need to do is invite your friends and have a good time at the Fireplace :)

[Here's a link to the working site](https://fireplace-debabratajr.vercel.app/). Have a look around, we made the frontend as intuitive as possible to make it supa easy for new users.

[And here's a link to the Github repo.](https://github.com/0xDebabrata/fireplace-server)

### The Team

- **Debabrata Mondal**
- **Anish Basu**
- **Debarghya Mondal**

### Demo 

Here's quick demo of Fireplace :
https://drive.google.com/file/d/1CoezdH2FRjMvC1k_CSzOwqemlauc9IZt/view?usp=sharing


### How it works

Supabase has been integral to finishing this project in such a short period of time. Here's how we used it's features to efficiently deploy our service:

1. When a user first signs in, fireplace sends a magic link using Supabase's email provider
2. All uploaded videos are stored in Supabase storage
3. Anytime a watchparty is created, Fireplace creates a signed URL in the background using Supabase functions which are stored in a Postgres database
4. All the media streaming is handled by Supabase as well

In addition to that, we also used Vercel to host the next.js app and Heroku to the deploy Fireplace.

### The process

The motivation for creating Fireplace came from us wanting to watch videos with our friends in a seamless manner. The pandemic made it even more necessary to find new ways to connect with relatives and Supabase provided a great opportunity to make this project a reality. 

From the get go we knew we need websockets to sync the video streams, but implementing it was a challenge on it's own.

Nevertheless we persevered and executed our vision to the best of our abilities.

### What's next?

We are confident in our abilities to take Fireplace to the next level. We have already made plans to implement a chat feature and more playback controls. We want to make Fireplace the easiest way to create watchparties and with the help of Supabase, we are extremely optimistic of what's to come.



