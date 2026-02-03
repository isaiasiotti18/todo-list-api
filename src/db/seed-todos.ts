import { db } from "."; // Ajuste o caminho conforme seu projeto
import { categories, todos } from "./schema"; // Ajuste o caminho
import { faker } from "@faker-js/faker/locale/pt_BR"; // Usando locale pt_BR
import type { TodoStatus } from "../types/TodoStatus";

function getRandomStatus(): TodoStatus {
  const random = Math.random();
  // Distribuição: completed 40%, in_progress 25%, in_planning 20%, canceled 10%, archived 5%
  if (random < 0.4) return "completed";
  if (random < 0.65) return "in_progress";
  if (random < 0.85) return "in_planning";
  if (random < 0.95) return "canceled";
  return "archived";
}

async function seed() {
  console.log("🌱 Iniciando seed...");

  try {
    // 1. Limpar dados existentes (opcional)
    console.log("🧹 Limpando dados existentes...");
    await db.delete(todos);
    await db.delete(categories);

    // 2. Inserir categorias
    console.log("📁 Criando categorias...");
    const categoriesData = [
      { id: 1, name: "Sem categoria", isSystem: true },
      { id: 2, name: "Estudos", isSystem: false },
      { id: 3, name: "Profissional", isSystem: false },
      { id: 4, name: "Pessoal", isSystem: false },
      { id: 5, name: "Diário", isSystem: false },
    ];

    await db.insert(categories).values(categoriesData);
    console.log(`✅ ${categoriesData.length} categorias criadas`);

    // 3. Inserir 200+ todos para o usuário ID 7
    console.log("📝 Criando todos...");

    const userId = 4;
    const numberOfTodos = 250; // Mais de 200
    const todosData = [];

    for (let i = 0; i < numberOfTodos; i++) {
      // Categoria aleatória (1-5)
      const categoryId = faker.number.int({ min: 1, max: 5 });

      // 80% dos todos não deletados, 20% deletados
      const isDeleted = faker.datatype.boolean({ probability: 0.2 });

      // Data de criação nos últimos 6 meses
      const createdAt = faker.date.recent({ days: 180 });

      // Data de atualização depois da criação
      const updatedAt = faker.date.between({
        from: createdAt,
        to: new Date(),
      });

      // 70% dos todos tem data de término, 30% não tem
      const hasEndDate = faker.datatype.boolean({ probability: 0.7 });
      const endDate = hasEndDate
        ? faker.date.soon({ days: 60, refDate: createdAt })
        : null;

      // Deletado em data aleatória após criação (se deletado)
      const deletedAt = isDeleted
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null;

      todosData.push({
        title: faker.helpers.arrayElement([
          // Estudos
          `Estudar ${faker.helpers.arrayElement(["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Python"])}`,
          `Ler capítulo ${faker.number.int({ min: 1, max: 20 })} de ${faker.lorem.words(3)}`,
          `Fazer exercícios de ${faker.helpers.arrayElement(["matemática", "programação", "inglês"])}`,
          `Assistir aula sobre ${faker.lorem.words(2)}`,

          // Profissional
          `Reunião com ${faker.person.firstName()}`,
          `Enviar relatório de ${faker.lorem.words(2)}`,
          `Revisar código do projeto ${faker.lorem.word()}`,
          `Preparar apresentação sobre ${faker.lorem.words(2)}`,
          `Responder emails do cliente`,

          // Pessoal
          `Comprar ${faker.commerce.productName()}`,
          `Ligar para ${faker.person.firstName()}`,
          `Organizar ${faker.helpers.arrayElement(["quarto", "armário", "documentos", "fotos"])}`,
          `Agendar ${faker.helpers.arrayElement(["médico", "dentista", "corte de cabelo"])}`,

          // Diário
          `${faker.helpers.arrayElement(["Fazer", "Preparar", "Organizar"])} ${faker.lorem.words(2)}`,
          `Lembrar de ${faker.lorem.words(3)}`,
        ]),
        description: faker.datatype.boolean({ probability: 0.7 })
          ? faker.lorem.sentence({ min: 5, max: 15 })
          : null,
        endDate,
        categoryId,
        status: getRandomStatus(),
        userId,
        createdAt,
        updatedAt,
        deletedAt,
      });
    }

    // Inserir em lotes de 50 para melhor performance
    const batchSize = 50;
    for (let i = 0; i < todosData.length; i += batchSize) {
      const batch = todosData.slice(i, i + batchSize);
      await db.insert(todos).values(batch);
      console.log(
        `✅ ${Math.min(i + batchSize, todosData.length)}/${numberOfTodos} todos criados`,
      );
    }

    console.log("🎉 Seed concluída com sucesso!");
    console.log(`📊 Resumo:`);
    console.log(`   - Categorias: ${categoriesData.length}`);
    console.log(`   - Todos: ${numberOfTodos}`);
    console.log(`   - Usuário ID: ${userId}`);
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  }
}

// Executar seed
seed()
  .then(() => {
    console.log("✨ Processo finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha no seed:", error);
    process.exit(1);
  });
