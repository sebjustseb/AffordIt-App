# AffordIt-App

AffordIt- App is a search engine created to help empower those wanting to travel, but not sure if financing the trip is a possibility. By allowing travellers to input origin of travel, desired destination, budget, and ideal dates of travel, AffordIt-App enlightens travellers if the trip will be possible based on those simple inputs.
The API's we chose were TripAdvisor and Booking.com to fetch prices of both flights and hotels, respectively. First, user's input is saved in a storage before we call our API's to run the functions we set including cheapest price for hotel and flight during the given dates. The results of the function are displayed on a secondary page indicating if the user is able to afford the desired trip.

Specs:
   -Call TripAdivsor APi to Desitination code
   -Bookings.com to check availiblity of hotels with the lowest price       within the targeted dates.
   -Interactive buttons.
   -Mobile friendly display.

Future Developement: 
   -From initial input results
      - can afford: give the option to purchase. 
      - if cannot: allow user to change the dates and/or show dates that    budget would work or show what percentage do they have vs what is needed. 
   - Provide useres with more specific search functions with the API.
      -Bookings.com API search if can afford based on hotel "star-ratings" 
   -  -Trip Advisor API search by first class and/ or shortest flight time. 

Screenshots: 
   ![Alt text](<assets/images/Screenshot 2024-01-10 at 1.25.50 PM.png>)
   ![Alt text](<assets/images/Screenshot 2024-01-10 at 1.29.23 PM.png>)

Contributions:
   -Sofia: built HTML and CSS
   -Aldo: JavaScript and TripAdvisor API
   -Sebatian: Bookings.com API
   -Hasani: Results Page and Readme  

Deployed Link: 
   https://sebjustseb.github.io/AffordIt-App/