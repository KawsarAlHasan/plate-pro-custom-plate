"use client";
import React, { useState } from "react";
import { useMyOrderLists } from "../api/userApi";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Spin,
  Alert,
  Modal,
  Descriptions,
  Image,
  Empty,
  Badge,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Orders({ ordersText }) {
  const { orderList, isLoading, isError, mutate } = useMyOrderLists();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => <div># {index + 1}</div>,
    },
    {
      title: ordersText?.product,
      dataIndex: "plate_items",
      key: "product",
      render: (items) => (
        <Space orientation="vertical" size="small">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              {item.icon && (
                <Image src={item.icon} alt={item.name} width={40} height={40} />
              )}
              <Text>{item.name}</Text>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: ordersText?.material,
      dataIndex: "material",
      key: "material",
      render: (material, record) => (
        <Space orientation="vertical" size="small">
          <Tag color="blue">{material?.name}</Tag>
          <Text type="secondary" className="text-xs">
            {record.thickness?.name} | {record.color}
          </Text>
        </Space>
      ),
    },
    {
      title: ordersText?.area,
      dataIndex: "tatalArea",
      key: "area",
      render: (area) => (
        <Text>
          {parseFloat(area).toFixed(2)} m<sup>2</sup>
        </Text>
      ),
    },
    {
      title: ordersText?.drillingHoles,
      dataIndex: "totalDrilingHoles",
      key: "holes",
      render: (holes) => (
        <Badge count={holes} showZero color="#52c41a" className="text-center" />
      ),
      align: "center",
    },
    {
      title: ordersText?.totalPrice,
      dataIndex: "total_price",
      key: "price",
      render: (price) => (
        <Text strong className="text-green-600 text-lg">
          ${parseFloat(price).toLocaleString()}
        </Text>
      ),
      width: 150,
    },
    {
      title: ordersText?.date,
      dataIndex: "created_at",
      key: "date",
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      ),
      width: 120,
    },
    {
      title: ordersText?.actions,
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetails(record)}
              size="small"
            />
          </Tooltip>
          {/* <Tooltip title="Download">
            <Button icon={<DownloadOutlined />} size="small" />
          </Tooltip> */}
        </Space>
      ),
      width: 120,
      fixed: "right",
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="!my-6 shadow-lg border-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <ShoppingOutlined className="text-white text-2xl" />
              </div>
              <div>
                <Title level={2} className="!mb-0">
                  {ordersText?.title}
                </Title>
                <Text type="secondary">
                  {ordersText?.totalOrders}: {orderList?.length || 0}
                </Text>
              </div>
            </div>
            {/* <Button type="primary" size="large" icon={<DownloadOutlined />}>
              Download All
            </Button> */}
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-2">
          <Card className="shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" className="text-xs">
                  {ordersText?.totalOrders}
                </Text>
                <Title level={3} className="!mb-0 !mt-1">
                  {orderList?.length || 0}
                </Title>
              </div>
              <CheckCircleOutlined className="text-3xl text-green-500" />
            </div>
          </Card>

          <Card className="shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" className="text-xs">
                  {ordersText?.totalSpent}
                </Text>
                <Title level={3} className="!mb-0 !mt-1 text-green-600">
                  $
                  {orderList
                    ?.reduce(
                      (sum, order) => sum + parseFloat(order.total_price),
                      0,
                    )
                    .toLocaleString() || 0}
                </Title>
              </div>
              <ClockCircleOutlined className="text-3xl text-blue-500" />
            </div>
          </Card>

          <Card className="shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" className="text-xs">
                  {ordersText?.totalArea}
                </Text>
                <Title level={3} className="!mb-0 !mt-1">
                  {orderList
                    ?.reduce(
                      (sum, order) => sum + parseFloat(order.tatalArea),
                      0,
                    )
                    .toFixed(2) || 0}{" "}
                  m²
                </Title>
              </div>
              <ShoppingOutlined className="text-3xl text-purple-500" />
            </div>
          </Card>
        </div>

        <Table
          rowKey={"id"}
          columns={columns}
          dataSource={orderList || []}
          loading={isLoading}
          pagination={false}
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingOutlined className="text-blue-500" />
            <span>
              {ordersText?.orderDetails} #{selectedOrder?.id}
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            {ordersText?.close}
          </Button>,
          // <Button
          //   key="download"
          //   type="primary"
          //   icon={<DownloadOutlined />}
          //   onClick={() => console.log("Download", selectedOrder)}
          // >
          //   Download
          // </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={ordersText?.orderId} span={2}>
                <Tag color="blue">#{selectedOrder.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.material}>
                {selectedOrder.material?.name}
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.thickness}>
                {selectedOrder.thickness?.name}
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.color}>
                <Tag color={selectedOrder.color}>{selectedOrder.color}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.totalArea}>
                {parseFloat(selectedOrder.tatalArea).toFixed(2)} m²
              </Descriptions.Item>
              {/* <Descriptions.Item label="Perimeter">
                {parseFloat(selectedOrder.totalPerimeter).toFixed(2)} m
              </Descriptions.Item> */}
              <Descriptions.Item label={ordersText?.drillingHoles}>
                {selectedOrder.totalDrilingHoles}
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.totalPrice} span={2}>
                <Text strong className="text-green-600 text-lg">
                  ${parseFloat(selectedOrder.total_price).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={ordersText?.orderDate} span={2}>
                {new Date(selectedOrder.created_at).toLocaleString("en-US")}
              </Descriptions.Item>
            </Descriptions>

            {/* Plate Items */}
            <div>
              <Title level={5}>{ordersText?.productItems}:</Title>
              {selectedOrder.plate_items?.map((item) => (
                <Card key={item.id} className="mb-3" size="small">
                  <div className="flex items-start gap-4">
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">
                        {item.name}
                      </Title>
                      <Text type="secondary" className="block mb-2">
                        {item.description}
                      </Text>
                      <Space wrap>
                        <Tag color="blue">
                          {ordersText?.points}: {item.points?.length || 0}
                        </Tag>
                        <Tag color="green">
                          {ordersText?.drilling}:{" "}
                          {item.drillingHole?.length || 0}
                        </Tag>
                        {item.closed && (
                          <Tag color="orange">{ordersText?.closed}</Tag>
                        )}
                      </Space>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Orders;
