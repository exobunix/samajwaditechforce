import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:share_plus/share_plus.dart';

class PostersTab extends StatefulWidget {
  const PostersTab({super.key});

  @override
  State<PostersTab> createState() => _PostersTabState();
}

class _PostersTabState extends State<PostersTab> {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  String _selectedFrame = 'assets/images/frame1.png';
  final TextEditingController _nameController = TextEditingController(text: 'सपा कार्यकर्ता');
  final TextEditingController _sloganController = TextEditingController(text: 'डिजिटल क्रांति का हिस्सा बनें');

  final List<String> _frames = [
    'assets/images/frame1.png',
    'assets/images/frame2.png',
    'assets/images/frame3.png',
  ];

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
      });
    }
  }

  void _sharePoster() {
    Share.share(
      'Check out my custom Samajwadi Tech Force poster!\nJoin Samajwadi Tech Force to design your own banner!',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFE30512),
        title: const Text(
          'पोस्टर निर्माता (Poster Editor)',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Poster Preview Area (Stack layout)
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.grey[200],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Slogan Background / Base Layer
                      Positioned.fill(
                        child: Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Color(0xFFE30512), Color(0xFF009933)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                          child: Center(
                            child: Padding(
                              padding: const EdgeInsets.only(top: 40.0),
                              child: Text(
                                _sloganController.text,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),

                      // User Selected Photo Layer
                      if (_selectedImage != null)
                        Positioned(
                          bottom: 40,
                          right: 20,
                          width: 100,
                          height: 120,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              _selectedImage!,
                              fit: BoxFit.cover,
                            ),
                          ),
                        )
                      else
                        Positioned(
                          bottom: 40,
                          right: 20,
                          width: 100,
                          height: 120,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white30,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.person, size: 40, color: Colors.white),
                          ),
                        ),

                      // Name Banner Layer
                      Positioned(
                        bottom: 12,
                        left: 16,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _nameController.text,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            const Text(
                              'सपा डिजिटल योद्धा',
                              style: TextStyle(
                                color: Color(0xFFFFEB3B),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Frame Overlay Layer
                      Positioned.fill(
                        child: Image.asset(
                          _selectedFrame,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Slogan & Name Inputs
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Your Name (आपका नाम)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.edit, color: Color(0xFF009933)),
              ),
              onChanged: (val) => setState(() {}),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _sloganController,
              decoration: const InputDecoration(
                labelText: 'Slogan (नारा / संदेश)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.message, color: Color(0xFF009933)),
              ),
              onChanged: (val) => setState(() {}),
            ),
            const SizedBox(height: 20),

            // Select Image Button
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: const Icon(Icons.add_a_photo),
              label: const Text('Add Your Photo'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF009933),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),

            const SizedBox(height: 24),

            // Frames Selection List
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Select Frame (फ्रेम चुनें):',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _frames.length,
                itemBuilder: (context, index) {
                  final frame = _frames[index];
                  final isSelected = frame == _selectedFrame;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedFrame = frame;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 12),
                      width: 80,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: isSelected ? const Color(0xFFE30512) : Colors.grey[300]!,
                          width: isSelected ? 3 : 1,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.asset(frame, fit: BoxFit.cover),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 32),

            // Share / Download actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Poster saved to gallery! 📸')),
                      );
                    },
                    icon: const Icon(Icons.download, color: Color(0xFFE30512)),
                    label: const Text('Save to Gallery', style: TextStyle(color: Color(0xFFE30512))),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: Color(0xFFE30512)),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _sharePoster,
                    icon: const Icon(Icons.share),
                    label: const Text('Share Poster'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE30512),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                )
              ],
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
