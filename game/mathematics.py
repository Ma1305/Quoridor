import math


def lcm(a, b):
    print(f"numbers: {a},{b} ")
    print(math.gcd(a, b))
    return int((a*b)/math.gcd(a, b))

