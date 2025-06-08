import React, { useState } from 'react';
import { Select, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Dashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    genre: [],
    country: [],
    type: [],
    status: []
  });

  // Dữ liệu mẫu - bạn có thể thay thế bằng dữ liệu từ ContextNavbar
  const genres = [
    { value: 'action', label: 'Hành động' },
    { value: 'comedy', label: 'Hài hước' },
    { value: 'drama', label: 'Tâm lý' },
    { value: 'horror', label: 'Kinh dị' },
    { value: 'romance', label: 'Lãng mạn' }
  ];

  const countries = [
    { value: 'vn', label: 'Việt Nam' },
    { value: 'kr', label: 'Hàn Quốc' },
    { value: 'jp', label: 'Nhật Bản' },
    { value: 'cn', label: 'Trung Quốc' },
    { value: 'us', label: 'Mỹ' }
  ];

  const types = [
    { value: 'movie', label: 'Phim lẻ' },
    { value: 'series', label: 'Phim bộ' },
    { value: 'anime', label: 'Anime' }
  ];

  const statuses = [
    { value: 'ongoing', label: 'Đang chiếu' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'upcoming', label: 'Sắp chiếu' }
  ];

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSearch = () => {
    // Xử lý tìm kiếm với các bộ lọc đã chọn
    console.log('Filters:', filters);
    // Thêm logic tìm kiếm của bạn ở đây
  };

  return (
    <div className="container mx-auto p-4">
      <Card title="Tìm kiếm nâng cao" className="mb-4">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label className="block mb-2">Thể loại:</label>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn thể loại"
              onChange={(value) => handleFilterChange('genre', value)}
              options={genres}
            />
          </div>

          <div>
            <label className="block mb-2">Quốc gia:</label>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn quốc gia"
              onChange={(value) => handleFilterChange('country', value)}
              options={countries}
            />
          </div>

          <div>
            <label className="block mb-2">Loại phim:</label>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn loại phim"
              onChange={(value) => handleFilterChange('type', value)}
              options={types}
            />
          </div>

          <div>
            <label className="block mb-2">Trạng thái:</label>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn trạng thái"
              onChange={(value) => handleFilterChange('status', value)}
              options={statuses}
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Tìm kiếm
          </button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard; 