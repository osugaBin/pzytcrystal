import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { crystalApi } from '../services/apiService';
import { Search, Gem, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const CrystalsPage = () => {
  const [crystals, setCrystals] = useState([]);
  const [filteredCrystals, setFilteredCrystals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  
  const elements = ['木', '火', '土', '金', '水'];
  const colors = ['紫色', '粉色', '百色', '黄色', '绿色', '黑色', '白色'];

  useEffect(() => {
    loadCrystals();
  }, []);

  useEffect(() => {
    filterCrystals();
  }, [crystals, searchTerm, selectedElement]);

  const loadCrystals = async () => {
    try {
      setLoading(true);
      const response = await crystalApi.getAllCrystals();
      setCrystals(response.crystals || []);
    } catch (error) {
      console.error('加载水晶数据失败:', error);
      toast.error('加载水晶数据失败');
    } finally {
      setLoading(false);
    }
  };

  const filterCrystals = () => {
    let filtered = crystals;
    
    // 按搜索关键词过滤
    if (searchTerm) {
      filtered = filtered.filter(crystal => 
        crystal.chinese_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crystal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crystal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按五行过滤
    if (selectedElement) {
      filtered = filtered.filter(crystal => 
        crystal.five_elements && crystal.five_elements.includes(selectedElement)
      );
    }
    
    setFilteredCrystals(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleElementFilter = (element) => {
    setSelectedElement(selectedElement === element ? '' : element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            PZYT水晶大全
          </h1>
          <p className="text-purple-200 text-lg">
            探索各种水晶的神奇力量和疗愈功效
          </p>
        </motion.div>

        {/* 搜索和过滤 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-8"
        >
          {/* 搜索框 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索水晶名称或功效..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
              />
            </div>
          </div>
          
          {/* 五行过滤 */}
          <div>
            <div className="flex items-center mb-3">
              <Filter className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-purple-200 font-medium">按五行过滤：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {elements.map((element) => (
                <button
                  key={element}
                  onClick={() => handleElementFilter(element)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedElement === element
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-800/30 text-purple-200 hover:bg-purple-700/50 hover:text-white'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 水晶网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrystals.map((crystal, index) => (
            <motion.div
              key={crystal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
            >
              {/* 水晶图片 */}
              {crystal.image_url && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={crystal.image_url}
                    alt={crystal.chinese_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* 水晶信息 */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">
                  {crystal.chinese_name}
                </h3>
                <p className="text-purple-300 text-sm mb-2">
                  {crystal.name}
                </p>
                
                {/* 五行和颜色 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {crystal.five_elements && crystal.five_elements.map((element, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-600/50 text-purple-200 text-xs rounded"
                    >
                      {element}
                    </span>
                  ))}
                  {crystal.color && (
                    <span className="px-2 py-1 bg-blue-600/50 text-blue-200 text-xs rounded">
                      {crystal.color}
                    </span>
                  )}
                </div>
                
                {/* 疗愈属性 */}
                {crystal.healing_properties && crystal.healing_properties.length > 0 && (
                  <div className="mb-3">
                    <p className="text-purple-200 text-xs mb-1">疗愈功效：</p>
                    <div className="flex flex-wrap gap-1">
                      {crystal.healing_properties.slice(0, 3).map((property, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-600/50 text-green-200 text-xs rounded"
                        >
                          {property}
                        </span>
                      ))}
                      {crystal.healing_properties.length > 3 && (
                        <span className="text-purple-300 text-xs">+{crystal.healing_properties.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 价格和描述 */}
                {crystal.price && (
                  <div className="text-yellow-400 font-bold text-lg mb-2">
                    ￥{crystal.price}
                  </div>
                )}
                
                {crystal.description && (
                  <p className="text-purple-200 text-sm line-clamp-2">
                    {crystal.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 无结果提示 */}
        {filteredCrystals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Gem className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              未找到匹配的水晶
            </h3>
            <p className="text-purple-200">
              请尝试调整搜索条件或清空过滤器
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CrystalsPage;