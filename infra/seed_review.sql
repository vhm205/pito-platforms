-- Set search path
SET search_path TO review_dba;

-- Seed data for admins
INSERT INTO admins (name, email) VALUES
('Nguyễn Văn An', 'an.nguyen@pito.vn'),
('Trần Thị Bình', 'binh.tran@pito.vn'),
('Lê Hoàng Cường', 'cuong.le@pito.vn');

-- Seed data for source_system
INSERT INTO source_system (system_name, description) VALUES
('Xpress', 'PITO XPress'),
('Custom Cater', 'PITO Custom Cater');

-- Seed data for customers
INSERT INTO customers (name, email, verified, external_customer_id, source_system_id) VALUES
('Phạm Minh Đức', 'duc.pham@pito.vn', true, 'KH001', 1),
('Hoàng Thị Em', 'em.hoang@pito.vn', false, 'KH002', 1),
('Vũ Đình Phúc', 'phuc.vu@pito.vn', true, 'KH003', 2);

-- Seed data for partners
INSERT INTO partners (name, profile_picture, external_partner_id, source_system_id) VALUES
('Nhà hàng Hương Việt', 'huong_viet.jpg', 'DT001', 1),
('Quán ăn Sài Gòn', 'saigon_quan.jpg', 'DT002', 1),
('Bếp nhà Hà Nội', 'hanoi_kitchen.jpg', 'DT003', 2);

-- Seed data for sub_orders
INSERT INTO sub_orders (customer_id, partner_id, order_status, external_order_id, source_system_id, external_sub_order_id) VALUES
(1, 1, 'Đã hoàn thành', 'DH001', 1, 'DH001-1'),
(2, 2, 'Đang giao hàng', 'DH002', 1, 'DH002-1'),
(3, 3, 'Đã hủy', 'DH003', 2, 'DH003-1');

-- Seed data for reviews
INSERT INTO reviews (comment, status, created_at, updated_at, source_system, order_id, review_photos, partner_id, customer_id, avg_rating_value) VALUES
('Món ăn rất ngon, giao hàng nhanh!', 'Đã duyệt', '2023-01-15 10:30:00', '2023-01-15 11:00:00', 'Xpress', 1, ARRAY['photo1.jpg', 'photo2.jpg'], 1, 1, 4.5),
('Đồ ăn nguội khi nhận được', 'Đang xem xét', '2023-01-16 19:45:00', '2023-01-16 20:15:00', 'Xpress', 2, ARRAY['photo3.jpg'], 2, 2, 2.0),
('Nhân viên phục vụ rất thân thiện', 'Đã duyệt', '2023-01-17 12:00:00', '2023-01-17 12:30:00', 'Custom Cater', 3, ARRAY['photo4.jpg', 'photo5.jpg'], 3, 3, 5.0);

-- Seed data for review_audit_log
INSERT INTO review_audit_log (review_id, change_type, previous_content, new_content, edited_by, timestamp, user_type) VALUES
(1, 'Chỉnh sửa nội dung', 'Món ăn rất ngon!', 'Món ăn rất ngon, giao hàng nhanh!', 1, '2023-01-15 11:00:00', 'Admin'),
(2, 'Thay đổi trạng thái', 'Mới', 'Đang xem xét', 2, '2023-01-16 20:15:00', 'Admin'),
(3, 'Thêm ảnh', NULL, 'photo5.jpg', 3, '2023-01-17 12:30:00', 'Admin');

-- Seed data for review_flags
INSERT INTO review_flags (review_id, flagged_by, reason, created_at) VALUES
(2, 1, 'Nội dung không phù hợp', '2023-01-16 21:00:00'),
(3, 2, 'Cần xác minh thông tin', '2023-01-17 13:00:00');

-- Seed data for review_status_history
INSERT INTO review_status_history (review_id, status, changed_by, reason, changed_at) VALUES
(1, 'Đã duyệt', 1, 'Đánh giá hợp lệ', '2023-01-15 11:00:00'),
(2, 'Đang xem xét', 2, 'Cần kiểm tra lại thông tin', '2023-01-16 20:15:00'),
(3, 'Đã duyệt', 3, 'Đánh giá tích cực', '2023-01-17 12:30:00');

-- Seed data for partner_replies
INSERT INTO partner_replies (review_id, partner_id, reply, status, created_at, updated_at) VALUES
(2, 2, 'Chúng tôi xin lỗi vì trải nghiệm không tốt của bạn. Chúng tôi sẽ cải thiện dịch vụ của mình.', 'Đã gửi', '2023-01-16 21:30:00', '2023-01-16 21:30:00');

-- Seed data for rating_categories
INSERT INTO rating_categories (name, description) VALUES
('Chất lượng món ăn', 'Đánh giá về hương vị, độ tươi ngon của món ăn'),
('Thời gian giao hàng', 'Đánh giá về tốc độ giao hàng'),
('Thái độ phục vụ', 'Đánh giá về thái độ của nhân viên giao hàng');

-- Seed data for review_ratings
INSERT INTO review_ratings (review_id, rating_category_id, rating_value) VALUES
(1, 1, 5),
(1, 2, 4),
(1, 3, 5),
(2, 1, 2),
(2, 2, 3),
(2, 3, 1),
(3, 1, 5),
(3, 2, 5),
(3, 3, 5);

-- Seed data for partner_review_summary
INSERT INTO partner_review_summary (partner_id, avg_rating_food_quality, avg_rating_delivery_timeliness, avg_rating_order_accuracy, avg_rating_packaging, total_reviews, total_replies) VALUES
(1, 4.5, 4.0, 4.5, 4.0, 10, 8),
(2, 3.5, 3.0, 3.5, 3.5, 5, 3),
(3, 5.0, 4.5, 5.0, 4.5, 15, 12);