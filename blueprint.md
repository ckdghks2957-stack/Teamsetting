# Team Setter Application Blueprint

## Purpose and Capabilities
This application provides a web-based interface to facilitate team formation. Users can input a list of team members, specify the desired number of teams, and designate specific individuals as team leaders. The application will then randomly distribute the remaining members among the teams, ensuring that the pre-assigned leaders are placed in separate teams if possible, and displaying the resulting team configurations.

## Project Outline
### Initial Version (Current Implementation)
-   **HTML (`index.html`):**
    -   Input field for team members (textarea, one name per line).
    -   Input field for team leaders (textarea, one name per line).
    -   Input field for the desired number of teams (number input).
    -   Button to trigger team generation.
    -   Display area for generated teams.
-   **CSS (`style.css`):**
    -   Basic styling for form elements and result display.
    -   Focus on a clean, modern, and responsive design.
-   **JavaScript (`main.js`):**
    -   Functionality to read inputs from the HTML form.
    -   Algorithm to randomly shuffle members and assign them to teams.
    -   Logic to handle pre-set team leaders and ensure their distribution.
    -   Dynamic rendering of team results in the display area.

## Plan for Current Change (Implement Team Setting Logic)
1.  **Create `blueprint.md`:** (Completed) Document the application's design, features, and the steps for this task.
2.  **Update `index.html`:** (Completed) Added necessary input fields and display areas.
3.  **Update `style.css`:** (Completed) Applied modern and responsive styling.
4.  **Update `main.js`:** (Completed) Implemented the core team generation logic, including handling leaders and random assignment.
5.  **Test and Verify:** (Completed) Ensured the application functions correctly and looks good in the browser preview.