// __tests__/order.test.js

const { Order, Item } = require('../src/order');

/**
 * Testes para a classe Item
 * Verificamos apenas se a construção do objeto funciona como esperado.
 */
describe('Item', () => {
  it('should create an item with id, name, and price', () => {
    const item = new Item(1, 'Laptop', 3500);
    
    expect(item.id).toBe(1);
    expect(item.name).toBe('Laptop');
    expect(item.price).toBe(3500);
  });
});

/**
 * Testes para a classe Order
 * Aqui testamos cada método e cada transição de estado.
 */
describe('Order', () => {
  // Dados de teste que serão reutilizados
  let mockItems;
  
  // O 'beforeEach' é executado antes de cada teste 'it' neste bloco 'describe'.
  // Isso garante que os testes sejam independentes uns dos outros.
  beforeEach(() => {
    mockItems = [
      new Item(1, 'Mouse', 100),
      new Item(2, 'Teclado', 250),
    ];
  });

  // --- Testes do Construtor e Cálculo Inicial ---
  describe('Constructor and Initial Calculation', () => {
    it('should create an order with default values and total 0', () => {
      const order = new Order(1);
      
      expect(order.id).toBe(1);
      expect(order.items).toEqual([]);
      expect(order.paymentMethod).toBe('cash');
      expect(order.status).toBe('created');
      expect(order.total).toBe(0);
    });

    it('should create an order with initial items and calculate the total', () => {
      const order = new Order(2, mockItems);
      
      expect(order.items.length).toBe(2);
      expect(order.total).toBe(350); // 100 + 250
    });
  });
  
  // --- Testes dos Métodos de Manipulação de Itens ---
  describe('Item Manipulation', () => {
    it('should add an item and update the total', () => {
      const order = new Order(3);
      order.addItem(new Item(3, 'Monitor', 1200));
      
      expect(order.items.length).toBe(1);
      expect(order.total).toBe(1200);
    });

    it('should remove an item by id and update the total', () => {
      const order = new Order(4, mockItems); // Total inicial é 350
      order.removeItem(1); // Remove o Mouse (id 1, preço 100)
      
      expect(order.items.length).toBe(1);
      expect(order.items[0].name).toBe('Teclado');
      expect(order.total).toBe(250);
    });

    it('should not change the order if removing a non-existent item', () => {
      const order = new Order(5, mockItems);
      order.removeItem(99); // ID que não existe

      expect(order.items.length).toBe(2);
      expect(order.total).toBe(350);
    });
  });
  
  // --- Testes de Transição de Status ---
  describe('Status Transitions', () => {
    // Testes para o método pay()
    it('should change status to "paid" when the order is "created"', () => {
      const order = new Order(6);
      order.pay();
      expect(order.status).toBe('paid');
    });

    it('should throw an error if trying to pay an order that is not "created"', () => {
      const order = new Order(7);
      order.status = 'cancelled'; // Força um estado inválido
      expect(() => order.pay()).toThrow('Order cannot be paid');
    });

    // Testes para o método complete()
    it('should change status to "completed" when the order is "paid"', () => {
      const order = new Order(8);
      order.pay(); // Primeiro paga
      order.complete(); // Depois completa
      expect(order.status).toBe('completed');
    });

    it('should throw an error if trying to complete an order that is not "paid"', () => {
      const order = new Order(9); // Status inicial é 'created'
      expect(() => order.complete()).toThrow('Order must be paid before it can be completed');
    });

    // Testes para o método cancel()
    it('should change status to "cancelled" for a "created" order', () => {
      const order = new Order(10);
      order.cancel();
      expect(order.status).toBe('cancelled');
    });

    it('should change status to "cancelled" for a "paid" order', () => {
      const order = new Order(11);
      order.pay();
      order.cancel();
      expect(order.status).toBe('cancelled');
    });

    it('should throw an error if trying to cancel a "completed" order', () => {
      const order = new Order(12);
      order.pay();
      order.complete();
      expect(() => order.cancel()).toThrow('Completed order cannot be cancelled');
    });
  });
});