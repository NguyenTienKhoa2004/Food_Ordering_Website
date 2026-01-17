const { getConnection } = require('../../db'); // Đảm bảo đường dẫn đúng
const slugify = require('slugify');

class itemModel {

    // Helper: Tạo slug duy nhất
    // Lưu ý: Hàm này nhận connection từ bên ngoài để tái sử dụng
    async generateUniqueSlug(name, connection, excludeId = null) {
        let baseSlug = slugify(name, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (true) {
            let sql = 'SELECT id FROM items WHERE slug = ?';
            const params = [slug];

            // Nếu đang edit, cần loại trừ ID hiện tại ra khỏi việc check trùng
            if (excludeId) {
                sql += ' AND id != ?';
                params.push(excludeId);
            }

            const [rows] = await connection.execute(sql, params);
            if (rows.length === 0) {
                return slug;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    // Thêm món mới
    async additem(itemData) {
        let connection;
        try {
            connection = await getConnection();

            const slug = await this.generateUniqueSlug(itemData.name, connection);

            const sql = 'INSERT INTO items (slug, name, description, image, price) VALUES (?, ?, ?, ?, ?)';
            const values = [slug, itemData.name, itemData.description, itemData.image, itemData.price];

            const [result] = await connection.execute(sql, values);
            return result;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        } finally {
            // QUAN TRỌNG: Luôn giải phóng kết nối ở đây
            if (connection) connection.release();
        }
    }

    // Lấy tất cả món
    async showitem() {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM items');
            return rows;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Lấy danh mục
    async showCategory() {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM categories');
            return rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Lấy gợi ý (random)
    async showSuggestions() {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM items ORDER BY RAND() LIMIT 5');
            return rows;
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Tìm món theo danh mục
    async getItemsByCategory(name) {
        let connection;
        try {
            connection = await getConnection();
            // Lưu ý: Dùng LIKE có thể chậm nếu dữ liệu lớn, cân nhắc dùng "=" nếu tìm chính xác
            const sql = 'SELECT * FROM items WHERE category LIKE ?';
            const [rows] = await connection.execute(sql, [`%${name}%`]);
            return rows;
        } catch (error) {
            console.error('Error fetching items by category:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Lấy món theo slug
    async getItemBySlug(slug) {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM items WHERE slug = ?', [slug]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching item by slug:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Sửa món ăn
    async editItem(id, itemData) {
        let connection;
        try {
            connection = await getConnection();

            // Check item tồn tại
            const [current] = await connection.execute('SELECT id, slug, name FROM items WHERE id = ?', [id]);
            if (current.length === 0) {
                throw new Error('Item not found');
            }

            // Generate slug mới nếu tên thay đổi
            let newSlug = current[0].slug;
            if (itemData.name && itemData.name !== current[0].name) {
                // Truyền id vào để hàm slug biết đường bỏ qua item hiện tại (tránh lỗi trùng slug với chính nó)
                newSlug = await this.generateUniqueSlug(itemData.name, connection, id);
            }

            const sql = 'UPDATE items SET slug = ?, name = ?, description = ?, image = ?, price = ? WHERE id = ?';
            const values = [
                newSlug,
                itemData.name,
                itemData.description,
                itemData.image,
                itemData.price,
                id
            ];

            const [result] = await connection.execute(sql, values);
            return result;
        } catch (error) {
            console.error('Error editing item:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Tìm kiếm
    async searchItems(query) {
        let connection;
        try {
            connection = await getConnection();
            const sql = 'SELECT * FROM items WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${query}%`;
            const [rows] = await connection.execute(sql, [searchTerm, searchTerm]);
            return rows;
        } catch (error) {
            console.error('Error searching items:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Xóa món
    async deleteItem(id) {
        let connection;
        try {
            connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM items WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = itemModel;