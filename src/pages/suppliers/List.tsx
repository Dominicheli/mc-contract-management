import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { ColumnsType } from "antd/es/table";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Supplier {
  Codigo: string;
  Descricao: string;
  CNPJ: string;
  id: string;
}

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      const response = await api.get<Supplier[]>("/fornecedores");
      setSuppliers(response.data);
    } catch (error) {
      message.error("Erro ao buscar fornecedores.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/fornecedores/${id}`);
      setSuppliers((prev) => prev.filter((item) => item.id !== id));
      message.success("Fornecedor excluído com sucesso.");
    } catch (error) {
      message.error("Erro ao excluir fornecedor.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const columns: ColumnsType<Supplier> = [
    {
      title: "Código",
      dataIndex: "Codigo",
      key: "Codigo",
    },
    {
      title: "Descrição",
      dataIndex: "Descricao",
      key: "Descricao",
    },
    {
      title: "CNPJ",
      dataIndex: "CNPJ",
      key: "CNPJ",
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: any, record: Supplier) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/fornecedores/editar/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h1>Fornecedores</h1>
        <Button type="primary" onClick={() => navigate("/fornecedores/novo")}>
          Novo Fornecedor
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={loading}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: <Empty description="Nenhum tipo de ativo encontrado." />,
        }}
      />
    </div>
  );
}
