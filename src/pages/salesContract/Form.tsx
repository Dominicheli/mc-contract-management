import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

export default function SalesContractForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [suppliers, setSuppliers] = useState([]);
  const [assets, setAssets] = useState([]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/fornecedores");

      const options = response.data.map((fornecedor: any) => ({
        label: fornecedor.Descricao,
        value: fornecedor.id,
      }));

      setSuppliers(options);
    } catch (error) {
      message.error("Erro ao buscar fornecedores.");
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get("/ativo");
      setAssets(response.data);
    } catch (error) {
      message.error("Erro ao buscar ativos.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchAssets();

    return () => {
      setSuppliers([]);
      setAssets([]);
    };
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await api.get(`/contrato_de_venda/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Erro ao carregar contrato.");
      }
    };

    if (id) fetchContract();
  }, [id, form]);

  const parseCurrencyToNumber = (value: string): number => {
    if (!value) return 0;
    return Number(value.replace(/\D/g, "")) / 100;
  };

  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      Desconto: parseCurrencyToNumber(values.Desconto),
      ValorTotal: parseCurrencyToNumber(values.ValorTotal),
      DataAlteracao: new Date().toISOString(),
      ...(id ? {} : { DataCriacao: new Date().toISOString() }),
    };

    try {
      if (id) {
        await api.put(`/contrato_de_venda/${id}`, payload);
        message.success("Contrato atualizado com sucesso!");
      } else {
        await api.post(`/contrato_de_venda`, payload);
        message.success("Contrato criado com sucesso!");
      }
      navigate("/contrato_de_venda");
    } catch (error) {
      message.error("Erro ao salvar contrato.");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Número do Contrato"
        name="NumeroContrato"
        rules={[{ required: true, message: "Informe o número do contrato" }]}
      >
        <Input placeholder="Digite o número do contrato" />
      </Form.Item>

      <Form.Item
        label="Fornecedor"
        name="FornecedorId"
        rules={[{ required: true, message: "Informe o fornecedor" }]}
      >
        <Select
          options={suppliers}
          placeholder="Selecione o fornecedor"
          loading={!suppliers.length}
        />
      </Form.Item>

      <Form.List
        name="Itens"
        rules={[
          {
            validator: async (_, items) => {
              if (items.length === 0) {
                return Promise.reject(new Error("Informe ao menos um item."));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: "flex",
                  marginBottom: 8,
                  justifyContent: "center",
                  width: "100%",
                }}
                align="start"
              >
                <Form.Item
                  {...restField}
                  name={[name, "AtivoId"]}
                  rules={[{ required: true, message: "Selecione o ativo" }]}
                >
                  <Select
                    options={assets}
                    placeholder="Ativo"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "Quantidade"]}
                  rules={[{ required: true, message: "Informe a quantidade" }]}
                >
                  <InputNumber
                    placeholder="Qtd"
                    min={1}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "PrecoUnitario"]}
                  rules={[
                    { required: true, message: "Informe o valor unitário" },
                  ]}
                >
                  <Input
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const numericValue = rawValue.replace(/\D/g, "");
                      const formatted = (
                        Number(numericValue) / 100
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      });
                      form.setFieldsValue({
                        Itens: form
                          .getFieldValue("Itens")
                          .map((item: any, idx: number) =>
                            idx === name
                              ? { ...item, PrecoUnitario: formatted }
                              : item
                          ),
                      });
                    }}
                  />
                </Form.Item>

                <MinusCircleOutlined
                  onClick={() => remove(name)}
                  style={{ marginTop: 8 }}
                />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Adicionar Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        label="Desconto"
        name="Desconto"
        rules={[{ required: true, message: "Informe o desconto" }]}
      >
        <Input
          placeholder="R$ 0,00"
          inputMode="numeric"
          onChange={(e) => {
            const rawValue = e.target.value;
            const numericValue = rawValue.replace(/\D/g, "");
            const formatted = (Number(numericValue) / 100).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            );
            form.setFieldsValue({ Desconto: formatted });
          }}
        />
      </Form.Item>

      <Form.Item
        label="Valor Total"
        name="ValorTotal"
        rules={[{ required: true, message: "Informe o valor total" }]}
      >
        <Input
          placeholder="R$ 0,00"
          inputMode="numeric"
          onChange={(e) => {
            const rawValue = e.target.value;
            const numericValue = rawValue.replace(/\D/g, "");
            const formatted = (Number(numericValue) / 100).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            );
            form.setFieldsValue({ ValorTotal: formatted });
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Atualizar" : "Criar"}
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/contrato_de_venda")}
        >
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
