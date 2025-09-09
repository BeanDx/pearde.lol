export type Project = {
  title: string;
  description: string;
  link: string;
  tech: string[];
  image?: string;
  legacy?: boolean;
};

export const baseProjects: Project[] = [
  {
    title: "pearde.lol",
    description: "Personal site with Linux/terminal vibes, ASCII UI, animations, and more.",
    link: "https://github.com/pearde/pearde.lol",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    image: "/projects/pearde-lol.png",
  },
  {
    title: "PicShareHub",
    description: "Minimal image sharing web app built with Express, EJS and local storage.",
    link: "https://github.com/BeanDx/PicShareHub",
    tech: ["Node.js", "Express", "EJS", "File Uploads"],
    image: "/projects/pic-share.png",
    legacy: true, 
  },
  {
    title: "gitfetch",
    description: "A fastfetch-inspired image-based neofetch clone.",
    link: "https://github.com/BeanDx/GitFetchCSharp",
    tech: ["C#", "CLI", "PNG rendering"],
    image: "/projects/gitfetch.png",
  },
  {
    title: "web-chat-soket-io",
    description: "Real-time chat app using socket.io, Express and vanilla JS.",
    link: "https://github.com/BeanDx/web-chat-soket-io",
    tech: ["Node.js", "Socket.io", "Express", "HTML/CSS/JS"],
    image: "/projects/web-chat.png",
    legacy: true,
  },
];
