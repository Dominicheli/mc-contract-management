import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Rule } from "antd/es/form";
import api from "../../services/api";

type FieldConfig = {
  label: string;
  name: string;
  rules: Rule[];
  maxLength?: number;
  extra?: string;
};

type TypeAssets = {
  id: number;
  Descricao: string;
  Codigo: string;
};

export default function AssetsForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [typeAssets, setTypeAssets] = useState<TypeAssets[]>([]);

  const fetchTypeAssets = async () => {
    try {
      const response = await api.get("/tipo_ativo");

      const options = response.data.map((type: any) => ({
        label: type.Descricao,
        value: type.id,
      }));

      setTypeAssets(options);
    } catch (error) {
      message.error("Erro ao buscar fornecedores.");
    }
  };

  useEffect(() => {
    fetchTypeAssets();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get(`/ativo/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Erro ao carregar ativo.");
      }
    };

    if (id) {
      fetchAssets();
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await api.put(`/ativo/${id}`, values);
        message.success("Ativo atualizado com sucesso!");
      } else {
        await api.post(`/ativo`, values);
        message.success("Ativo criado com sucesso!");
      }
      navigate("/ativo");
    } catch (error) {
      message.error("Erro ao salvar ativo.");
    }
  };

  const fields: FieldConfig[] = [
    {
      label: "Código",
      name: "Codigo",
      rules: [
        { required: true, message: "Informe o código do ativo" },
        {
          pattern: /^[A-Z]{4}\d{3}$/,
          message: "Formato inválido. Ex: ATIV001",
        },
      ],
      maxLength: 7,
      extra: "Formato: 4 letras maiúsculas + 3 números (ex: ATIV001)",
    },
    {
      label: "Descrição",
      name: "Descricao",
      rules: [
        { required: true, message: "Informe a descrição do ativo" },
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

      <Form.Item
        label="Tipo de Ativo"
        name="TipoAtivoId"
        rules={[{ required: true, message: "Selecione o tipo de ativo" }]}
      >
        <Select
          options={typeAssets}
          placeholder="Selecione o tipo de ativo"
          loading={!typeAssets.length}
        />
      </Form.Item>

      <Form.Item
        label="Preço de Venda"
        name="PrecoVenda"
        rules={[{ required: true, message: "Informe o preço de venda" }]}
      >
        <Input
          type="text"
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
            form.setFieldsValue({ PrecoVenda: formatted });
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? "Atualizar" : "Criar"}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate("/ativo")}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
