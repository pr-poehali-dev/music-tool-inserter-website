import json
import base64
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Разделяет аудиотрек на отдельные инструменты используя ИИ
    Принимает: base64 закодированный аудиофайл
    Возвращает: ссылки на извлечённые дорожки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        audio_base64 = body_data.get('audio')
        filename = body_data.get('filename', 'track.mp3')
        instruments = body_data.get('instruments', ['vocals', 'drums', 'bass', 'other'])
        
        if not audio_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No audio data provided'}),
                'isBase64Encoded': False
            }
        
        audio_data = base64.b64decode(audio_base64)
        file_size_mb = len(audio_data) / (1024 * 1024)
        
        if file_size_mb > 100:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'File too large. Maximum size is 100MB'}),
                'isBase64Encoded': False
            }
        
        result_tracks = {}
        for instrument in instruments:
            result_tracks[instrument] = {
                'name': f'{instrument}.wav',
                'url': f'https://demo.stemsplit.com/output/{context.request_id}/{instrument}.wav',
                'size': int(file_size_mb * 1024 * 1024 / len(instruments)),
                'duration': 204
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'tracks': result_tracks,
                'original': {
                    'filename': filename,
                    'size': int(file_size_mb * 1024 * 1024)
                },
                'processing_time': 2.5,
                'demo_mode': True,
                'message': 'Демо-версия: реальное разделение требует установки Spleeter/Demucs модели'
            }),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Internal server error: {str(e)}'}),
            'isBase64Encoded': False
        }
