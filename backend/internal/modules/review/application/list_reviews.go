package application

import (
	"context"
	"time"

	"login-firebase/internal/modules/review/domain"
)

type ListReviews struct {
	repo domain.ReviewRepository
}

func NewListReviews(repo domain.ReviewRepository) *ListReviews {
	return &ListReviews{repo: repo}
}

func (uc *ListReviews) Execute(ctx context.Context) ([]*domain.Review, error) {
	count, err := uc.repo.Count(ctx)
	if err == nil && count == 0 {
		// Seed mock reviews
		mocks := []*domain.Review{
			{
				ID:        "rev-1",
				Company:   "SCG Internship Program",
				Role:      "UX/UI Designer",
				Content:   "บรรยากาศดีมากครับ กินอิ่มนอนหลับ ได้เล่นเกมทุกวัน ตอนนี้โดนไล่ออกละครับ",
				Author:    "Nanthanit Vareerak",
				Date:      "21/6/26 07:52",
				Status:    "pending",
				CreatedAt: time.Now().Add(-5 * time.Hour),
				UpdatedAt: time.Now().Add(-5 * time.Hour),
			},
			{
				ID:        "rev-2",
				Company:   "Agoda Tech Internship",
				Role:      "Software Engineer",
				Content:   "รุ่นพี่ใจดีมากครับ ได้เขียนระบบ Production จริง ท้าทายสุดๆ มีขนมและเครื่องดื่มกินฟรีตลอดวัน แนะนำเลยครับ",
				Author:    "Pitiwat Promsuban",
				Date:      "20/6/26 14:30",
				Status:    "approved",
				CreatedAt: time.Now().Add(-24 * time.Hour),
				UpdatedAt: time.Now().Add(-24 * time.Hour),
			},
			{
				ID:        "rev-3",
				Company:   "LINE MAN Wongnai",
				Role:      "Product Manager Intern",
				Content:   "ได้ลองทำ Product Spec และเข้าประชุมกับทีม Dev จริงๆ สังคมอบอุ่นและเปิดกว้างมาก ได้รับความรู้เต็มเปี่ยม",
				Author:    "Suchada Srisai",
				Date:      "18/6/26 09:15",
				Status:    "pending",
				CreatedAt: time.Now().Add(-48 * time.Hour),
				UpdatedAt: time.Now().Add(-48 * time.Hour),
			},
			{
				ID:        "rev-4",
				Company:   "KBTG Internship",
				Role:      "Data Scientist",
				Content:   "พี่ๆ เมนเทอร์ดูแลใกล้ชิดมาก ได้เรียนรู้โมเดล Machine Learning และวิเคราะห์ข้อมูลระดับ Enterprise สนุกมาก",
				Author:    "Kittisak J.",
				Date:      "15/6/26 17:05",
				Status:    "approved",
				CreatedAt: time.Now().Add(-5 * 24 * time.Hour),
				UpdatedAt: time.Now().Add(-5 * 24 * time.Hour),
			},
			{
				ID:        "rev-5",
				Company:   "Shopee Thailand",
				Role:      "Marketing Intern",
				Content:   "งานเร็วและท้าทายมาก ได้เรียนรู้แคมเปญใหญ่ๆ เช่น 11.11 ระบบการจัดการดีเยี่ยม ได้เพื่อนใหม่เยอะมาก",
				Author:    "Nattaporn K.",
				Date:      "12/6/26 11:22",
				Status:    "pending",
				CreatedAt: time.Now().Add(-10 * 24 * time.Hour),
				UpdatedAt: time.Now().Add(-10 * 24 * time.Hour),
			},
			{
				ID:        "rev-6",
				Company:   "SCB 10X",
				Role:      "Frontend Developer",
				Content:   "ได้เขียน React และ Next.js ในการทำงานจริงๆ มีโอกาสเสนอไอเดียและลงมือทำ ได้พัฒนาฝีมือเร็วมาก",
				Author:    "Tanapat P.",
				Date:      "10/6/26 16:40",
				Status:    "pending",
				CreatedAt: time.Now().Add(-15 * 24 * time.Hour),
				UpdatedAt: time.Now().Add(-15 * 24 * time.Hour),
			},
		}

		for _, mock := range mocks {
			_ = uc.repo.Create(ctx, mock)
		}
	}

	return uc.repo.List(ctx)
}
