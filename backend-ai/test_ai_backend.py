"""
Unit and Integration Tests for Cafe Companion AI Backend
"""

import unittest
from fastapi.testclient import TestClient
from main import app, MENU_ITEMS

class TestCafeCompanionBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_health(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["service"], "Cafe Companion AI Backend")
        self.assertEqual(data["status"], "online")

    def test_get_menu(self):
        response = self.client.get("/api/menu")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("menu", data)
        self.assertGreater(len(data["menu"]), 0)
        # Check story video attributes exist (Instagram-style)
        self.assertIn("story_video_url", data["menu"][0])
        self.assertIn("story_title", data["menu"][0])

    def test_get_patrons_cafe_mode(self):
        response = self.client.get("/api/patrons")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("patrons", data)
        self.assertGreater(len(data["patrons"]), 0)
        self.assertIn("status_badge", data["patrons"][0])
        self.assertIn("looking_for", data["patrons"][0])

    def test_queue_prediction(self):
        response = self.client.get("/api/queue/predict?item_ids=item-1,item-6&active_baristas=2")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("estimated_wait_seconds", data)
        self.assertIn("crowd_status", data)
        self.assertIn("best_time_to_visit", data)
        self.assertGreater(data["estimated_wait_seconds"], 0)

    def test_smart_conversational_ordering(self):
        payload = {
            "user_input": "Can I get an iced vanilla oat latte with less sweet, and a croissant?",
            "dietary_preferences": ["Gluten-Free"],
            "customer_name": "Sarah"
        }
        response = self.client.post("/api/ai/order", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("items", data)
        self.assertGreater(len(data["items"]), 0)
        self.assertGreater(data["total_price"], 0)
        self.assertIn("ai_response_message", data)
        # Verify allergy warning detected for croissant gluten
        self.assertTrue(any("Gluten" in w for w in data["dietary_warnings"]))

    def test_icebreaker_cafe_mode(self):
        payload = {
            "user_a_name": "Elena",
            "user_a_role": "AI Engineer",
            "user_a_project": "Agentic workflows",
            "user_a_interests": ["AI", "Specialty Coffee", "Rock Climbing"],
            "user_b_name": "Marcus",
            "user_b_role": "Product Designer",
            "user_b_project": "Community apps",
            "user_b_interests": ["Figma", "Specialty Coffee", "Synthesizers"]
        }
        response = self.client.post("/api/ai/icebreaker", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("icebreaker_text", data)
        self.assertIn("Specialty Coffee", data["common_topics"])
        self.assertIn("suggested_micro_action", data)

    def test_ambient_feedback_and_room_sentiment(self):
        # 1. Post negative feedback
        fb_payload = {
            "category": "TEMPERATURE",
            "sentiment_tag": "TOO_COLD",
            "comment": "AC is freezing at table 4",
            "table_number": "Table 04"
        }
        res_fb = self.client.post("/api/feedback", json=fb_payload)
        self.assertEqual(res_fb.status_code, 200)

        # 2. Query Room Sentiment & Barista Copilot
        res_sent = self.client.get("/api/ai/room-sentiment")
        self.assertEqual(res_sent.status_code, 200)
        data = res_sent.json()
        self.assertIn("vibe_summary", data)
        self.assertIn("immediate_alerts", data)
        self.assertTrue(any(a["category"] == "TEMPERATURE" for a in data["immediate_alerts"]))

    def test_personalized_recommendation(self):
        payload = {
            "weather": "Cold & Raining",
            "temperature_c": 14.5,
            "mood": "Deep Focus"
        }
        response = self.client.post("/api/ai/recommend", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreater(len(data["recommendations"]), 0)

if __name__ == "__main__":
    unittest.main()
