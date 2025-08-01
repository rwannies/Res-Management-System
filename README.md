Resource Management System



A web-based application for managing resources such as equipment, rooms, and tools. Built with HTML, CSS, and JavaScript, it provides CRUD (Create, Read, Update, Delete) functionality, search, sorting, pagination, import/export, and dark mode support. The application uses localStorage for data persistence and is designed with accessibility in mind.


Features


CRUD Operations: Add, view, edit, and delete resources with fields for name, type, status, and description.


Search: Filter resources by name or description with real-time results.


Sorting: Sort resources by name, type, or status (ascending/descending).


Pagination: Display resources in pages (10 per page) with Previous/Next navigation.


Import/Export: Export resources as JSON and import from JSON files.


Dark Mode: Toggle between light and dark themes, with system preference detection and localStorage persistence.


Accessibility: Includes ARIA attributes, keyboard navigation, and high-contrast mode support.


Responsive Design: Optimized for desktop and mobile devices.


User Feedback: Toast notifications for actions like adding, editing, or deleting resources.




Installation


Clone the Repository:

git clone https://github.com/rwannies/resource-management-system.git

cd resource-management-system


Serve the Application:

Option 1: Open index.html directly in a web browser (e.g., Chrome, Firefox).

Option 2: Use a local server for better compatibility:npx http-server

Then navigate to http://localhost:8080 in your browser.

No additional dependencies are required since the project uses vanilla HTML, CSS, and JavaScript.


Usage

Open the Application:

Open index.html in a browser or access it via a local server.

The main interface displays a table of resources, with options to add, search, filter, sort, and navigate pages.


Managing Resources:

Add: Click "Add Resource" to open a modal, fill in the form, and submit.


Edit: Click "Edit" on a resource to modify its details.


Delete: Click "Delete" and confirm to remove a resource.


Search: Enter text in the search bar to filter resources by name or description.


Filter: Use the "Filter by Type" dropdown to show specific resource types.


Sort: Click column headers (Name, Type, Status) to sort in ascending or descending order.


Pagination: Use "Previous" and "Next" buttons to navigate pages.


Import/Export: Export resources to a JSON file or import from a JSON file.



Theme Switching:

Toggle dark mode using the switch in the header.

The application respects system preferences (prefers-color-scheme) and saves your choice in localStorage.



File Structure


resource-management-system/
├── index.html        # Main HTML file with the application structure
├── style.css         # CSS for styling and theming (light/dark modes)
├── script.js         # JavaScript for functionality and logic
├── screenshots/      # Folder for screenshots (add your own)
└── README.md         # This file



Accessibility Features

ARIA attributes (aria-label, aria-live, aria-sort, etc.) for screen reader support.

Keyboard navigation (e.g., Escape to close modals, focusable buttons).

High-contrast mode support for better visibility.

Semantic HTML (header, main, section, etc.) for better structure.

Focus states for interactive elements (buttons, sort headers).


Contributing

Contributions are welcome! To contribute:

Fork the repository.

Create a new branch:git checkout -b feature/your-feature-name


Make your changes and commit:git commit -m "Add your feature description"


Push to your branch:git push origin feature/your-feature-name


Open a pull request with a clear description of your changes.

Please ensure your code follows the existing style, includes accessibility considerations, and is tested across browsers.



Future Improvements

Add user authentication for access control.

Implement a backend API (e.g., Node.js with MongoDB) for server-side storage.

Support bulk actions (e.g., delete multiple resources).

Add a history log for resource changes.

Include unit tests with Jest for JavaScript logic.

Enhance customization with user settings for font size or contrast.



License

This project is licensed under the MIT License. See the LICENSE file for details.




Contact

For issues or suggestions, open an issue on GitHub or contact wanniesruche@gmail.com
