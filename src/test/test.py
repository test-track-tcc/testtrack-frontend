import unittest
from matematica import calcular_area_circulo
import math

class TestMatematica(unittest.TestCase):

    def test_area_circulo_positivo(self):
        """
        Testa o cálculo da área de um círculo com raio positivo.
        """
        # Teste com um raio conhecido (raio = 5)
        raio = 5
        area_esperada = math.pi * (raio ** 2)
        area_calculada = calcular_area_circulo(raio)
        self.assertAlmostEqual(area_calculada, area_esperada, places=7)

        # Teste com outro raio positivo (raio = 10)
        raio = 10
        area_esperada = math.pi * (raio ** 2)
        area_calculada = calcular_area_circulo(raio)
        self.assertAlmostEqual(area_calculada, area_esperada, places=7)

    def test_area_circulo_zero(self):
        """
        Testa o cálculo da área de um círculo com raio zero.
        """
        raio = 0
        area_esperada = 0
        area_calculada = calcular_area_circulo(raio)
        self.assertEqual(area_calculada, area_esperada)

    def test_area_circulo_negativo(self):
        """
        Testa o cálculo da área de um círculo com raio negativo.
        Espera que o resultado seja 0.
        """
        raio = -5
        area_esperada = 0
        area_calculada = calcular_area_circulo(raio)
        self.assertEqual(area_calculada, area_esperada)

    def test_area_circulo_tipo_invalido(self):
        """
        Testa se a função lida corretamente com tipos de entrada inválidos (não numéricos).
        Espera que uma exceção TypeError seja levantada.
        """
        with self.assertRaises(TypeError):
            calcular_area_circulo("abc")

if __name__ == '__main__':
    unittest.main()