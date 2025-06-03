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

export default function TypeAssetsForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTypeAssets = async () => {
      try {
        const response = await api.get(`/tipo_ativo/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Erro ao carregar tipo de ativo.");
      }
    };

    if (id) {
      fetchTypeAssets();
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await api.put(`/tipo_ativo/${id}`, values);
        message.success("Tipo de Ativo atualizado com sucesso!");
      } else {
        await api.post(`/tipo_ativo`, values);
        message.success("Tipo de Ativo criado com sucesso!");
      }
      navigate("/tipo-de-ativo");
    } catch (error) {
      message.error("Erro ao salvar Tipo de Ativo.");
    }
  };

  const fields: FieldConfig[] = [
    {
      label: "Código",
      name: "Codigo",
      rules: [
        { required: true, message: "Informe o código do tipo de ativo" },
        {
          pattern: /^[A-Z]{4}\d{3}$/,
          message: "Formato inválido. Ex: TIPO001",
        },
      ],
      maxLength: 7,
      extra: "Formato: 4 letras maiúsculas + 3 números (ex: TIPO001)",
    },
    {
      label: "Descrição",
      name: "Descricao",
      rules: [
        { required: true, message: "Informe a descrição do tipo de ativo" },
        { type: "string", max: 20, message: "Máximo de 20 caracteres" },
      ],
      extra: "Máximo de 20 caracteres",
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
          onClick={() => navigate("/tipo-de-ativo")}
        >
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
