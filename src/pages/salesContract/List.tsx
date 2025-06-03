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
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface SalesContract {
  NumeroContrato: string;
  DataCriacao: Date;
  DataAlteracao: Date;
  Itens: {
    AtivoId: string;
    Quantidade: number;
    PrecoUnitario: number;
  }[];

  Desconto: number;
  ValorTotal: number;
  id: string;
  FornecedorId: string;
}

export default function SalesContractList() {
  const [salesContract, setSalesContract] = useState<SalesContract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSalesContract = async () => {
    try {
      const response = await api.get<SalesContract[]>("/contrato_de_venda");
      setSalesContract(response.data);
    } catch (error) {
      message.error("Erro ao buscar contrato de venda.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contrato_de_venda/${id}`);
      setSalesContract((prev) => prev.filter((item: any) => item.id !== id));
      message.success("Contrato de venda excluído com sucesso.");
    } catch (error) {
      message.error("Erro ao excluir contrato de venda.");
    }
  };

  useEffect(() => {
    fetchSalesContract();
  }, []);

  const columns: ColumnsType<SalesContract> = [
    {
      title: "Número do Contrato",
      dataIndex: "NumeroContrato",
      key: "NumeroContrato",
    },
    {
      title: "Data de Alteração",
      dataIndex: "DataAlteracao",
      key: "DataAlteracao",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY [às] HH:mm"),
    },
    {
      title: "Desconto",
      dataIndex: "Desconto",
      key: "Desconto",
      render: (value: number) =>
        value?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      title: "Valor Total",
      dataIndex: "ValorTotal",
      key: "ValorTotal",
      render: (value: number) =>
        value?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: any, record: SalesContract) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/contrato_de_venda/editar/${record.id}`)}
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
        <h1>Contrato de Venda</h1>
        <Button
          type="primary"
          onClick={() => navigate("/contrato_de_venda/novo")}
        >
          Novo Contrato de Venda
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={salesContract}
        loading={loading}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: (
            <Empty description="Nenhum contrato de venda encontrado." />
          ),
        }}
      />
    </div>
  );
}
