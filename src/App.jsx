import React, { useEffect, useState } from 'react'
import {Row, Col, Card, notification, Modal} from 'antd';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get('./src/data.json');
        setData(response.data);
      } catch (err) {
        notification.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const showModal = (item) => {
    setModalContent(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  if (isLoading) {
    return <div>Loading page...</div>;
  }


  const movieItems = data.slice(1,7);
  const bannerItem = data.find(item => item.id === '1');

  return (
    <div className="py-6 px-20 min-h-screen bg-[#192026] text-white">
      <div className='mb-4 flex gap-2 justify-between items-center'>
        <div className='text-4xl font-bold'>Anonime</div>
        <div className='flex gap-20 justify-around'>
            <a className='text-[#868686] text-xl' href='#'>Home</a>
            <a className='text-[#868686] text-xl' href='#'>List anime</a>
        </div>
        <input type="text" className='border-0 bg-[#374151] rounded-3xl px-10 py-3' placeholder='Search anime or movie ...'/>
      </div>

      <div>
        <div className='text-3xl font-semibold my-10'>Explore</div>
        <p className='text-xl mb-8 text-[#868686]'>What are you gonna watch today?</p>
        <div 
          className="relative p-10 h-[600px] bg-cover bg-center flex flex-col justify-end items-start rounded-lg cursor-pointer"
          style={{ backgroundImage: `linear-gradient(to top, rgba(29, 29, 29, 0.8), transparent 80%), url(${bannerItem?.image})`}}
          onClick={() => showModal(bannerItem)}>
            <h3 className="text-3xl font-semibold mb-8">{bannerItem?.movieName}</h3>
            <p className="text-lg w-1/2">{bannerItem?.description?.slice(0, Math.floor(bannerItem?.description?.length/2))}...</p>
        </div>
      </div>

      <div>
      <div className='text-3xl font-semibold my-10'>New Release</div>
        <Row gutter={[16, 16]}>
          {movieItems.map((item, index) => (
            <Col xs={24} sm={12} md={4} key={index} className='flex flex-col border-none text-center rounded-lg'>
              <Card
                className="relative h-[400px] bg-cover bg-center text-lg text-white cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(15, 30, 41, 1), transparent 80%), url(${item.image})`}}
                onClick={() => showModal(item)}
              >
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-center">{`Episode ${item.episode}`}</div>
                </div>
              </Card>
              
              <p className='text-xl cursor-pointer' onClick={() => showModal(item)}>{item.movieName}</p>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title={<span style={{ fontSize: '24px' }}>Movie Details</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        className='text-[#192026] text-lg'
        getContainer={false}
        footer={null}
      >
        <div className='flex gap-10'>
          <img src={modalContent?.image} className='object-contain h-full w-[200px]'></img>

          <div className='flex flex-col gap-4 mb-4'>
            <p><span className='font-semibold'>Name</span>: {modalContent?.movieName}</p>
            <p><span className='font-semibold'>Episode</span>: {modalContent?.episode}</p>
            <p><span className='font-semibold'>Description</span>: {modalContent?.description}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App