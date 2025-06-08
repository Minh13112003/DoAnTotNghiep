import { FaFilm, FaList, FaUsers } from 'react-icons/fa';

export const slidebarMenus = [
    {
        title: 'Quản lý Phim',
        icon: <FaFilm />,
        items: [
            { title: 'Danh sách phim', link: '/quan-ly/phim/danh-sach' },
            { title: 'Danh sách tập phim', link: '/quan-ly/phim/tap-phim' },
        ]
    },
    {
        title: 'Quản lý Thể loại',
        icon: <FaList />,
        items: [
            { title: 'Danh sách thể loại', link: '/quan-ly/the-loai/danh-sach' },
            { title: 'Thêm thể loại', link: '/quan-ly/the-loai/them-moi' },
        ]
    },
    {
        title: 'Quản lý Tài khoản',
        icon: <FaUsers />,
        items: [
            { title: 'Danh sách người dùng', link: '/quan-ly/tai-khoan/danh-sach' },
            { title: 'Thêm người dùng', link: '/quan-ly/tai-khoan/them-moi' },
        ]
    },
    {
        title: 'Quản lý Bình luận',
        icon: <FaList />,
        items: [
            { title: 'Danh sách bình luận', link: '/quan-ly/binh-luan' },
            { title: 'Bình luận bị báo cáo', link: '/quan-ly/binh-luan/bao-cao' },
        ]
    },
    {
        title: 'Quản lý Góp ý',
        icon: <FaList />,
        items: [
            { title: 'Danh sách góp ý', link: '/quan-ly/gop-y' },
        ]
    }
];