💰 Finance DashBoard 

This is a simple finance dashboard I built using HTML, CSS, and JavaScript to track income,expenses and spending patterns in a clean and interactive way.

The goal of this project was to practice frontend fundamentals while building something practical and easy to use.

🚀 What this Project does

The dashboard gives a quick overview of your financial data and helps you understand where your money is going.

you can:

 - See your total balance, income, and expenses
 - Visualize spending through charts
 - Browse and filter transactions
 - Switch between different user roles
 - Get small insights based on your data

 📊 Dashboard

 The main dashboard shows:
 
  - A summary of your finances (balance,income,expenses)
  - A line chart to track monthly expenses
  - A pie chart to understand category-wise spending

  🧾 Transactions
  
  All transactions ate listed in a simple table with:
  
   - Date (grouped by month)
   - Amount
   - Category
   - Type(income or expense)

   You can :
   
    - Search transactions by category
    - Filter by income or expense

  👤 Roles 
   There are two roles in the app:

   Viewer
   
    - Can only view data 
    - Cannot modify data

   Admin
   
    - Can add and edit transactions

  you can switch roles using a dropdown , which changes what actions are available.

  💡 Insights 

   There's a small insights section that highlights:
   
    - Your highest spending category 
    - Monthly spending trend
    - Basic observations based on your data
  
  🧠 How state is handled

  Instead of using any framework , I used a central JavaScript state object to manage :
  
   - Transactions
   - Filters
   - Current Role
  Whenever the state updates , the UI updates accordingly.

  🌙 Extra touches 

  I added a afew features to make the app feel more complete:
  
   - Dark mode toggle
   - Toast notification for actions(add and edit)
   - LocalStorage support (data stays after refresh)
   - Responsive layout (works on mobile and desktop)
   - Smooth UI transitions
  
  🛠️ Tech used 

   - HTML5
   - CSS3
   - JavaScript
   - Chart.js for data visualization

  🧑‍💻 How to run

  No setup required:
   1. Download or clone the project
   2. Open index.html in your browser

   📌Notes

    • This uses mock data(no backend)
    • Data is stored in LocalStorage
    • Monthly calculations are based on transaction dates
    • Input validation is basic

  📈 Possible improvements 

   if I continue this project, I'd like to add:
   
    - Delete transactions
    - Export data (CSV/JSON)
    - Proper form UI instead of prompts
    - More charts (income vs expense comparison)
  
  💬 Final Thoughts

  This project was mainly about:
  
   - Practicing clean UI design
   - Managing state without frameworks
   - Working with charts and dynamic data
  

  

