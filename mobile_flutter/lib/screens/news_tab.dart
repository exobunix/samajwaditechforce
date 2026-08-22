import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../services/api_service.dart';

class NewsTab extends StatefulWidget {
  const NewsTab({super.key});

  @override
  State<NewsTab> createState() => _NewsTabState();
}

class _NewsTabState extends State<NewsTab> {
  List<dynamic> newsList = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNews();
  }

  Future<void> _fetchNews() async {
    final feeds = await ApiService.fetchNews();
    setState(() {
      newsList = feeds;
      isLoading = false;
    });
  }

  void _shareNews(Map<String, dynamic> item) {
    Share.share(
      '${item['title']}\n\nRead more details inside STF App.\nJoin Samajwadi Tech Force today!',
      subject: 'Samajwadi Party News',
    );
  }

  Future<void> _likeNews(String id, int index) async {
    final success = await ApiService.likeNews(id);
    if (success) {
      setState(() {
        newsList[index]['likes'] = (newsList[index]['likes'] ?? 0) + 1;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('News liked! ❤️')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF009933),
        title: const Text(
          'सपा समाचार (News Feed)',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchNews,
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: newsList.length,
                itemBuilder: (context, index) {
                  final item = newsList[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Static / Fallback Campaign Image placeholder for news
                        Container(
                          height: 180,
                          width: double.infinity,
                          decoration: const BoxDecoration(
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                            gradient: LinearGradient(
                              colors: [Color(0xFFE30512), Color(0xFF009933)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.campaign,
                              size: 60,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['title'] ?? 'SP Campaign News',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item['content'] ?? '',
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(color: Colors.grey[700], height: 1.4),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      IconButton(
                                        icon: const Icon(Icons.favorite_border, color: Color(0xFFE30512)),
                                        onPressed: () => _likeNews(item['_id'], index),
                                      ),
                                      Text('${item['likes'] ?? 0} Likes'),
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      IconButton(
                                        icon: const Icon(Icons.share, color: Color(0xFF009933)),
                                        onPressed: () => _shareNews(item),
                                      ),
                                      const Text('Share'),
                                    ],
                                  ),
                                  TextButton(
                                    onPressed: () => _showDetailDialog(item),
                                    child: const Text('Read More'),
                                  )
                                ],
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }

  void _showDetailDialog(Map<String, dynamic> item) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(item['title']),
          content: SingleChildScrollView(
            child: Text(
              item['content'],
              style: const TextStyle(fontSize: 16, height: 1.5),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                _shareNews(item);
              },
              icon: const Icon(Icons.share),
              label: const Text('Share'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE30512),
                foregroundColor: Colors.white,
              ),
            )
          ],
        );
      },
    );
  }
}
