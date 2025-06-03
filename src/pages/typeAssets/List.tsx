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

interface TypeAssets {
  Codigo: string;
  Descricao: string;
  id: string;
}

export default function TypeAssetsList() {
  const [typeAssets, setTypeAssets] = useState<TypeAssets[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTypeAssets = async () => {
    try {
      const response = await api.get<TypeAssets[]>("/tipo_ativo");
      setTypeAssets(response.data);
    } catch (error) {
      message.error("Erro ao buscar Tipo de Ativo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tipo_ativo/${id}`);
      setTypeAssets((prev) => prev.filter((item: any) => item.id !== id));
      message.success("Tipo de Ativo excluído com sucesso.");
    } catch (error) {
      message.error("Erro ao excluir Tipo de Ativo.");
    }
  };

  useEffect(() => {
    fetchTypeAssets();
  }, []);

  const columns: ColumnsType<TypeAssets> = [
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
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: any, record: TypeAssets) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/tipo_ativo/editar/${record.id}`)}
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
        <h1>Tipo de Ativo</h1>
        <Button type="primary" onClick={() => navigate("/tipo-de-ativo/novo")}>
          Novo Tipo de Ativo
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={typeAssets}
        loading={loading}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: <Empty description="Nenhum tipo de ativo encontrado." />,
        }}
      />
    </div>
  );
}
