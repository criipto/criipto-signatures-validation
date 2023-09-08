#!/bin/bash

cd library && npm ci
cd ../backend && npm ci
cd ../frontend && npm ci