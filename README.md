# AntiSocialMakanClub
An app made for students in NUS to find people to dine with based on their preferences.

Proposed Level of Achievement: Apollo 11

App Description: 
AntiSocialMakanClub is an app catered to NUS students to find a meal buddy to dine together at a NUS canteen of their choice. Users can make a request indicating their day and time preference to be submitted to the app for matching. Canteen and spoken language preferences (optional) may be indicated during the request creation process as well. 

Motivation: 
The motivation behind the creation of AntiSocialMakanClub stems from the challenges NUS' students face in coordinating meal times when their friend group has conflicting schedules. 

This app aims to address feelings of isolation and loneliness if one were to dine alone. It offers opportunities for users to broaden their social circles and step out of their comfort zones. By meeting new people from diverse backgrounds, the app helps foster a sense of belonging as a NUS student. 

AntiSocialMakanClub helps in promoting a vibrant and inclusive campus culture, where students are able to forge meaningful bonds beyond their immediate circles. This facilitates the sharing of information and insights across various divides, including academic disciplines and residential arrangements.

Proposed Core Features:
#1 User Authentication - Users can create an account and log in. The app recognises if an incorrect password is submitted and prompts the users to resubmit the correct password.
#2 Request Creation - Users can create a request detailing the day, time, canteen and spoken language preferences.
#3 Meal Buddy Matching - Users' request is matched with another user with the same preferences.
#4 Chat Functionality - Once matched, users can choose to chat with their matched meal buddy.
#5 Notification - Users will receive a notification when a match is successful.
#6 Request Cancellation - If there has been a change of plans, users can cancel the request. 

Plan:
As of milestone 1, we have implemented features #1 and #2. Firebase is integrated to assist in user authentication and Firestore installed to function as the app database. Users are able to register for an account and log in with the correct username and password. In the Home Screen, users can create a request by selecting the correct option from the dropdowns. Users are only able to select a timeslot after they select their day of choice. Measures are put in place to avoid duplicated requests as well. We have exercised version control with Git and GitHub as well, by pushing commits to the GitHub repository whenever we make changes to our code and User Interface.

In upcoming versions of the app, users would be able to chat with their matched meal buddy to flesh out the details of their meetup. Users would be able to cancel their request as well. Our goal is to implement a matching algorithm for the "Meal Buddy Matching" feature and to integrate Socket.io for our chat functionality by Milestone 2. By Milestone 3, we hope to have completed the Notification function as well as the Request Cancellation feature.

We will continuously improve our user interface to enhance user-friendliness and integrate automated testing to ensure our app's functionality. 