# ✍️ Digitized Signature

A small weekend project that turns keyboard input into a unique, digitized signature.

Instead of drawing with a mouse or touchscreen, this tool maps each character to its position on a keyboard layout and generates a smooth signature path from it. Simple idea, surprisingly satisfying.

## ✨ Features

* ⌨️ Keyboard-based signature generation

* 🎨 Customizable stroke:

  * Solid or gradient

  * Adjustable width

  * 🎨 Color controls

* 🧠 Multiple curve algorithms

* 🔢 Optional number row support

* 👀 Live keyboard visualization

* 📤 Export as SVG or PNG

* 🌙 Clean, minimal UI (dark-mode friendly)

# 🧩 How It Works

1. Each key has a fixed position in a keyboard layout (QWERTY, etc.)

2. Typed characters are converted into points

3. Points are connected using a curve algorithm

4. The resulting path becomes your signature

No canvas hacks — just geometry + SVG.

# 🛠️ Tech Stack

* Next.js (App Router)

* React

* TypeScript

* Tailwind CSS

* Framer Motion

* SVG Path Generation

# 🚀 Getting Started
```
git clone https://github.com/SyedJunaidAli1/Digitizedsignature
cd digitizedsignature
bun install
bun run dev
```

Open ``` http://localhost:3000```  to view it in the browser.

# 📦 Exporting

* SVG → perfect for logos, websites, and print

* PNG → quick sharing and previews

Exports use the same geometry as the live preview, so what you see is what you get.

# 🧪 Project Status

This is a weekend / experimental project.

Built mainly to:

  * Explore SVG path generation

  * Experiment with keyboard-driven visuals

  * Practice clean UI + motion

Not intended to replace real handwritten signatures 🙂

🌱 Future Ideas (Maybe)

* Stroke draw animation

* Pressure / velocity-based stroke width

* More keyboard layouts

* Preset signature styles

* Mobile-friendly scaling

# 🤝 Contributing

Ideas, issues, and PRs are welcome.
This project is intentionally simple — feel free to build on top of it.

# 📄 License

MIT License

# 📝 Author

Syed Junaid Ali
Built with curiosity, coffee, and a free weekend ☕💻
