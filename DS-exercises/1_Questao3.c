#include <stdio.h>
#include <stdlib.h>
void incr_vetor (int n, int *v) {
    int i;
    for (i = 0; i < n; i++) {
        v[i]++;
    }
}

int main ( ) {
    int a[] = {1, 3, 5};
    incr_vetor(3.5, a);

    printf("%d %d %d \n", a[0], a[1], a[2]);
    return 0;
}
