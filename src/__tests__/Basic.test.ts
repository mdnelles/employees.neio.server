import request from 'supertest';
import { api, schemas, tables } from "../routes/Basic";

describe('API Tests', () => {
    // Test for the "api" endpoint
    it('should return status 201, err false, and the correct message', async () => {
      const response = await request(api).get('/');
      expect(response.status).toBe(201);
      expect(response.body.err).toBe(false);
      expect(response.body.msg).toBe('basic api');
    });
  
    // Test for the "schemas" endpoint
    it('should return status 201, err false, and the list of schemas', async () => {
      const response = await request(schemas).get('/');
      expect(response.status).toBe(201);
      expect(response.body.err).toBe(false);
      expect(response.body.msg).toBe('ok');
      expect(response.body.schemas).toBeDefined();
    });
  
    // Test for the "tables" endpoint
    it('should return status 201, err false, and the list of tables', async () => {
      const response = await request(tables).get('/');
      expect(response.status).toBe(201);
      expect(response.body.err).toBe(false);
      expect(response.body.msg).toBe('ok');
      expect(response.body.tables).toBeDefined();
    });
  });