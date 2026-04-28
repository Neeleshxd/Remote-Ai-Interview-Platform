#!/bin/bash

# Test AI Assistant Integration

echo "🧪 Testing AI Assistant Integration..."
echo ""

# Test 1: Check Python
echo "1️⃣  Testing Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ $PYTHON_VERSION"
else
    echo "❌ Python 3 not found"
    exit 1
fi

# Test 2: Check Node.js
echo ""
echo "2️⃣  Testing Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Test 3: Check required Python packages
echo ""
echo "3️⃣  Checking Python dependencies..."
REQUIRED_PACKAGES=("requests" "flask" "flask_cors" "dotenv")

for package in "${REQUIRED_PACKAGES[@]}"; do
    if python3 -c "import ${package}" 2>/dev/null; then
        echo "✅ $package"
    else
        echo "❌ $package - Install with: pip install -r ai-assistant/requirements.txt"
    fi
done

# Test 4: Check .env file
echo ""
echo "4️⃣  Checking environment variables..."
if [ -f "ai-assistant/.env" ]; then
    if grep -q "GEMINI_API_KEY" ai-assistant/.env; then
        echo "✅ .env file found with GEMINI_API_KEY"
    else
        echo "⚠️  .env file found but GEMINI_API_KEY not set"
    fi
else
    echo "⚠️  .env file not found. Create it with: GEMINI_API_KEY=your_key"
fi

# Test 5: Check if ports are available
echo ""
echo "5️⃣  Checking ports..."
if ! lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 5000 available (Flask)"
else
    echo "⚠️  Port 5000 in use (Flask)"
fi

if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 3000 available (Next.js)"
else
    echo "⚠️  Port 3000 in use (Next.js)"
fi

# Test 6: Check file structure
echo ""
echo "6️⃣  Checking file structure..."
required_files=(
    "ai-assistant/ai.py"
    "ai-assistant/api_server.py"
    "src/components/AIAssistantSidebar.tsx"
    "src/app/api/ai/route.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - Missing!"
    fi
done

echo ""
echo "✨ All checks complete!"
echo ""
echo "Next steps:"
echo "1. Make sure GEMINI_API_KEY is set in ai-assistant/.env"
echo "2. Run: ./start-all.sh"
echo "3. Open http://localhost:3000"
