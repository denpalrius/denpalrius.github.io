# Dennis Muticia Portfolio Website

A responsive, theme-aware personal static portfolio website showcasing my projects, research, experience, skills, and blog posts.

## Live Site

The website is live and accessible at [https://denpalrius.github.io](https://denpalrius.github.io)

## Features

* **Responsive Design**: Single-page layout that adapts to all screen sizes (mobile, tablet, desktop).
* **Light & Dark Theme**: Toggle between light and dark modes using CSS variables.
* **Projects Section**: Displays project cards with technology chips and GitHub links.
* **Experience Timeline**: Vertical timeline highlighting work history and achievements.
* **Skills & Education**: Organized chips and lists to showcase technical skills and academic background.
* **Blog Previews**: Card layout with images and links to external articles.
* **Contact Form**: AJAX-powered form integration via Formspree with in-page modal feedback.
* **Appointment Scheduling**: Embedded Google Calendar appointment buttons with theme-matched styling.
* **Footer**: Social media links with SVG icons and dynamic copyuright.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/denpalrius/portfolio-website.git
   cd portfolio-website
   ```

2. **Open `index.html`**

   * You can simply open the file in your browser for local testing.

3. **Deploy**

   * Push the repository to GitHub and enable GitHub Pages on the `main` branch.
   * Or deploy to Vercel/Netlify by linking your repo.

## Configuration

* **Theme Toggle**: In `script.js`, the theme is stored in `localStorage` and toggled via `data-theme`.
* **Contact Form**: Update the Formspree `formID` in `script.js` to match your Formspree project.
* **Appointment Buttons**: Ensure the `data-schedule-url`, `data-label`, and `data-color` attributes match your Google Calendar setup.
* **Images**: Replace placeholder images in the `images/` folder with your own assets.
* **Social Links**: Update URLs in the footer to your LinkedIn, GitHub, X, and any other socials.

## File Structure

```
├── index.html        # Main HTML page
├── styles.css        # Core CSS with theme variables
├── script.js         # JavaScript for theme toggle, form, and scheduling buttons
├── images/           # Profile picture, project & blog images
└── README.md         # Project overview and setup instructions
```

## License

This repository is open-source and available under the MIT License. Feel free to fork and customize.

