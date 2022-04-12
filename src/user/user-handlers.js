import express from 'express';
import { validate } from './user-model.js';
import auth from '../middleware/auth.js';
import { read, remove, update } from './user-service.js';

const router = express.Router();

router.get('/:email', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await read(req.params.email);
  if (!user) return res.status(400).send('User does not exist.');

  return res.send(user);
});

router.delete('/:email', auth, async (req, res) => {
  const user = await read(req.params.email);
  if (!user) return res.status(400).send('User does not exist.');

  await remove(req.params.email);
  return res.send('User deleted.');
});

router.put('/:email', auth, async (req, res) => {
  const user = await read(req.params.email);
  if (!user) return res.status(400).send('User does not exist.');

  await update(req.params.email, req.body.password);

  return res.send('Password successfully changed.');
});
export default router;
