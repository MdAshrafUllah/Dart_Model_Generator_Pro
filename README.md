# 🚀 Dart Model Generator Pro

A powerful online tool to generate Dart model classes from JSON instantly. Supports Freezed, JsonSerializable, and Normal Dart classes with smart type detection.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)](https://github.com/MdAshrafUllah)

---

## ✨ Features

- 🎯 **Multiple Generation Modes**
  - Normal Dart Class
  - Freezed Class
  - JsonSerializable Class
  - Freezed + JsonSerializable (Mix)

- 🔍 **Smart Type Detection**
  - String, int, double, bool
  - List<T> with nested type detection
  - Nested object class generation

- 🎨 **Modern UI/UX**
  - Light/Dark theme toggle
  - Auto-resizing textarea
  - One-click copy to clipboard
  - Responsive design for all devices

- ⚙️ **Advanced Options**
  - Optional private fields (Normal mode)
  - Required parameter toggle
  - Custom file naming for parts
  - PascalCase validation

- ♿ **Accessibility**
  - ARIA labels support
  - Keyboard navigation ready
  - Screen reader friendly

---

## 🚀 Live Demo

Try it now: [Dart Model Generator Pro](https://mdashrafullah.github.io/Dart_Model_Generator_Pro/)

---

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Animations
- **JavaScript (ES6+)** - Modules, Async/Await
- **Material Icons** - Google Fonts
- **No External Dependencies** - Pure Vanilla JS

---

## 📖 How to Use

### 1️⃣ Online Version

1. Visit the [Live Demo](https://mdashrafullah.github.io/Dart_Model_Generator_Pro/)
2. Enter your class name (PascalCase)
3. Paste your JSON data
4. Select generation mode
5. Click **Generate**
6. Copy the generated Dart code

### 2️⃣ Local Setup

```bash
# Clone the repository
git clone https://github.com/MdAshrafUllah/dart-model-generator.git

# Navigate to project folder
cd dart-model-generator

# Open in browser
open index.html
```

---

## 📝 Example

### Input JSON:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
```

### Generated Output (Freezed + JsonSerializable):

```dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'model.freezed.dart';
part 'model.g.dart';

@freezed
abstract class User with _$User {
  const factory User({
    int? id,
    String? name,
    String? email,
    bool? isActive,
    Address? address,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

@JsonSerializable(explicitToJson: true)
class Address {
  final String? street;
  final String? city;

  Address({this.street, this.city});

  factory Address.fromJson(Map<String, dynamic> json) => _$AddressFromJson(json);
  Map<String, dynamic> toJson() => _$AddressToJson(this);
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to branch (`git push origin feature/AmazingFeature`)
5. 🔁 Open a Pull Request

---

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/MdAshrafUllah/dart-model-generator/issues) with:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Md Ashraf Ullah**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MdAshrafUllah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mdashrafullah)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=about.me&logoColor=white)](https://mdashrafullah.github.io/Flutter-portfolio/)

---

## ⭐ Show Your Support

If this project helped you, please consider:

- ⭐ Starring the repository
- 🐦 Sharing it on social media
- 💬 Mentioning it in your Flutter community

---

## 🙏 Acknowledgments

- [Flutter](https://flutter.dev) - Amazing framework
- [Freezed](https://pub.dev/packages/freezed) - Code generation package
- [json_serializable](https://pub.dev/packages/json_serializable) - JSON handling
- [Google Fonts](https://fonts.google.com) - Material Icons

---

## 📁 ফাইল স্ট্রাকচার:

```
dart-model-generator pro/
├── README.md           # এই ফাইলটি
├── LICENSE             # MIT License ফাইল
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── generator.js
    ├── utils.js
    ├── theme.js
    └── clipboard.js
```

---

<div align="center">
  <strong>Made with ❤️ for the Flutter community</strong>
  <br><br>
  <sub>© 2026 Dart Model Generator Pro. All rights reserved.</sub>
</div>
