#ifndef POWERBLADE_UART_H_
#define POWERBLADE_UART_H_

#include "powerblade_test.h"

char captureBuf[RXLEN - 3];

void uart_init(void);
void uart_enable(bool enable);
void uart_stuff(unsigned int offset, char* srcbuf, unsigned int len);
void uart_send(void);

int processMessage(void);

#endif // POWERBLADE_UART_H_