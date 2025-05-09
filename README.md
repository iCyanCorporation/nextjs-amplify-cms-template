# nextjs-amplify-cms-template

A full-stack web application template built with Next.js and AWS Amplify, featuring a public website, blog system, and admin dashboard.

## Features

- 🚀 Next.js 14+ with App Router
- ⚡ AWS Amplify Gen2 Backend
- 🎨 Shadcn/ui Components
- 🌍 i18n Support
- 📝 Rich Text Editor (Tiptap)
- 🔒 Authentication & Authorization
- 📱 Responsive Design
- 🧪 Jest Testing Setup

## Prerequisites

- Node.js 18.x or higher
- AWS Account
- npm or yarn
- AWS Amplify CLI v12.x or higher (`npm install -g @aws-amplify/cli@latest`)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/nextjs-amplify-cms-template.git
cd nextjs-amplify-cms-template
```

2. Install dependencies

```bash
npm install
```

3. Deploy a fullstack app to AWS and Initialize and deploy backend (Amplify Gen2)

- Follow [Quick Start Guide](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)

4. Start the development server

```bash
npm run dev
```

## Project Structure

```
nextjs-amplify-cms-template/
├── app/                # Next.js app router pages
├── amplify/           # Amplify Gen2 backend configuration
│   ├── backend/       # Backend resources definitions
│   ├── data/         # GraphQL schema and resolvers
│   └── auth/         # Authentication configuration
├── components/        # Reusable React components
├── lib/              # Utility functions and configurations
├── public/           # Static assets
└── styles/           # Global styles
```

## Backend Development (Amplify Gen2)

note...

## Testing

Run the test suite:

```bash
npm run test
```

Watch mode for development:

```bash
npm run test:watch
```

## Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy to AWS Amplify:

- Deploy cloud sandbox

```bash
npx ampx sandbox
```

- Upload your code to Github

## Using as a Template

1. Fork this repository
2. Update the configuration files
3. Customize the components and styles
4. Update the content and branding

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [AWS Amplify(NextJS)](https://docs.amplify.aws/nextjs/start/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TipTap](https://tiptap.dev/)

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!
