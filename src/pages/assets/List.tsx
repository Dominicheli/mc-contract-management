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

interface Assets {
  id: string;
  Codigo: string;
  Descricao: string;
  TipoAtivoId: string;
  PrecoVenda: string;
}

export default function AssetsList() {
  const [assets, setAssets] = useState<Assets[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAssets = async () => {
    try {
      const response = await api.get<Assets[]>("/ativo");
      setAssets(response.data);
    } catch (error) {
      message.error("Erro ao buscar fornecedores.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/ativo/${id}`);
      setAssets((prev) => prev.filter((item: any) => item.id !== id));
      message.success("Fornecedor excluído com sucesso.");
    } catch (error) {
      message.error("Erro ao excluir fornecedor.");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const columns: ColumnsType<Assets> = [
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
      title: "Tipo do Ativo",
      dataIndex: "TipoAtivoId",
      key: "TipoAtivoId",
    },
    {
      title: "Preço de Venda",
      dataIndex: "PrecoVenda",
      key: "PrecoVenda",
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: any, record: Assets) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/ativo/editar/${record.id}`)}
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
        <h1>Ativos</h1>
        <Button type="primary" onClick={() => navigate("/ativo/novo")}>
          Novo Ativo
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={assets}
        loading={loading}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: <Empty description="Nenhum ativo encontrado." />,
        }}
      />
    </div>
  );
}
