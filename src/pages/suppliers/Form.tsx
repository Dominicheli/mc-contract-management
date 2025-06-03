import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { Rule } from "antd/es/form";
import api from "../../services/api";
import { useEffect } from "react";

type FieldConfig = {
  label: string;
  name: string;
  rules: Rule[];
  maxLength?: number;
  extra?: string;
};

export default function SupplierForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await api.get(`/fornecedores/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Erro ao carregar fornecedor.");
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await api.put(`/fornecedores/${id}`, values);
        message.success("Fornecedor atualizado com sucesso!");
      } else {
        await api.post(`/fornecedores`, values);
        message.success("Fornecedor criado com sucesso!");
      }
      navigate("/fornecedores");
    } catch (error) {
      message.error("Erro ao salvar fornecedor.");
    }
  };

  const fields: FieldConfig[] = [
    {
      label: "Código",
      name: "Codigo",
      rules: [
        { required: true, message: "Informe o código do fornecedor" },
        {
          pattern: /^[A-Z]{4}\d{3}$/,
          message: "Formato inválido. Ex: FORN001",
        },
      ],
      maxLength: 7,
      extra: "Formato: 4 letras maiúsculas + 3 números (ex: FORN001)",
    },
    {
      label: "Descrição",
      name: "Descricao",
      rules: [
        { required: true, message: "Informe a descrição do fornecedor" },
        { type: "string", max: 55, message: "Máximo de 55 caracteres" },
      ],
      extra: "Máximo de 55 caracteres",
    },
    {
      label: "CNPJ",
      name: "CNPJ",
      rules: [
        { required: true, message: "Informe o CNPJ do fornecedor" },
        {
          pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
          message: "CNPJ inválido. Ex: 12.345.678/0001-90",
        },
      ],
      maxLength: 18,
      extra: "Formato: 00.000.000/0000-00",
    },
  ];

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
          extra={field.extra}
        >
          <Input maxLength={field.maxLength} />
        </Form.Item>
      ))}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Atualizar" : "Criar"}
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/fornecedores")}
        >
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
